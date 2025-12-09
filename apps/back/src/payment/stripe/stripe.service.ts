import { AuthRepository } from '@auth/auth.repository';
import { IUser } from '@auth/interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLogger, DatabaseService } from '@services';
import Stripe from 'stripe';
import { formatAmount, getNextBillingDate, mapStatus } from './util';
import {
  PaymentTransactionRepository,
  UserSubscriptionRepository,
} from 'payment/repositories';
import { Prisma, UserSubscription } from '@prisma/client';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  private readonly WEBHOOK_SECRET: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepo: AuthRepository,
    private readonly logger: CustomLogger,
    private readonly userSubscriptionRepo: UserSubscriptionRepository,
    private readonly paymentTransactionRepo: PaymentTransactionRepository,
    private readonly db: DatabaseService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('stripe.secretKey'),
      {
        apiVersion: this.configService.getOrThrow('stripe.apiVersion'),
      },
    );
    this.WEBHOOK_SECRET = this.configService.getOrThrow('stripe.webhookSecret');
  }

  async initPayment(
    user: IUser,
    priceId: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not initialized');
    }

    if (!user.id) {
      throw new BadRequestException('User ID is required');
    }

    const existingSubscription = await this.db.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (existingSubscription) {
      const activeStatuses: Array<'active' | 'trialing'> = [
        'active',
        'trialing',
      ];

      if (
        activeStatuses.includes(
          existingSubscription.status as 'active' | 'trialing',
        )
      ) {
        throw new BadRequestException(
          'You already have an active subscription. Please cancel your current subscription before creating a new one.',
        );
      }
    }

    const successUrl = `${this.configService.getOrThrow('client.uri')}/payment?status=success`;
    const cancelUrl = `${this.configService.getOrThrow('client.uri')}/dashboard`;

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        phone: user.phone,
        address: {
          city: user.city,
          country: 'AM',
        },
      });
      customerId = customer.id;

      await this.authRepo.update(user.id, {
        stripeCustomerId: customerId,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id?.toString(),
        ...metadata,
      },
    });

    return session;
  }

  async getAllPlanDetails() {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not initialized');
    }

    const BASE_PRICE = 18000;
    const plansResponse = await this.stripe.plans.list({
      active: true,
    });

    const result = plansResponse.data.map((plan) => {
      const amount = plan.amount || 0;

      const difference = BASE_PRICE - amount;
      const percent = (difference / BASE_PRICE) * 100;

      return {
        id: plan.id,
        amount: formatAmount(amount, 'usd'),
        interval: plan.interval as 'month' | 'year',
        ...(plan.interval === 'year' && {
          savingAmount: formatAmount(difference, 'usd'),
        }),
        ...(plan.interval === 'year' && {
          savingPercent: `${percent.toFixed(0)}%`,
        }),
      };
    });

    return result;
  }

  async constructEvent(
    rawBody: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    try {
      if (!rawBody) {
        throw new BadRequestException('Missing raw body in request');
      }

      return await this.stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        this.WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new BadRequestException(
        `Webhook signature verification failed ${error.message}`,
      );
    }
  }

  async handleWebhookEvents(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const payment = event.data.object as Stripe.Checkout.Session;
        return this.handleCheckoutCompleted(payment);
      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        return this.handleSubscriptionCreated(subscription);
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        return this.handleSubscriptionUpdated(subscriptionUpdated);
      case 'invoice.payment_succeeded':
        const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;
        return this.handleInvoiceSucceeded(invoicePaymentSucceeded);
      case 'invoice.payment_failed':
        const invoicePaymentFailed = event.data.object as Stripe.Invoice;
        return this.handleInvoiceFailed(invoicePaymentFailed);
      default:
        return { message: 'Webhook received' };
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) throw new BadRequestException('Missing userId in metadata');

    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      this.logger.warn('Checkout completed without subscription');
      return;
    }

    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    await this.saveSubscription({ userId, subscription });
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const user = await this.findUserByCustomer(
      this.getCustomerId(subscription),
    );
    await this.saveSubscription({ userId: user.id, subscription });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const user = await this.findUserByCustomer(
      this.getCustomerId(subscription),
    );
    await this.saveSubscription({ userId: user.id, subscription });
  }

  private async handleInvoiceSucceeded(invoice: Stripe.Invoice) {
    const user = await this.findUserByCustomer(this.getCustomerId(invoice));

    const invoiceAny = invoice as any;
    await this.paymentTransactionRepo.createTransaction({
      userId: user.id,
      stripeSubscriptionId:
        typeof invoiceAny.subscription === 'string'
          ? invoiceAny.subscription
          : invoiceAny.subscription?.id || null,
      stripeInvoiceId: invoice.id,
      stripeChargeId:
        typeof invoiceAny.charge === 'string'
          ? invoiceAny.charge
          : invoiceAny.charge?.id || null,
      stripePaymentIntentId:
        typeof invoiceAny.payment_intent === 'string'
          ? invoiceAny.payment_intent
          : invoiceAny.payment_intent?.id || null,
      amount: invoice.amount_paid || 0,
      currency: invoice.currency || 'usd',
      status: 'success',
      description: 'Recurring invoice payment',
    });
  }

  private async handleInvoiceFailed(invoice: Stripe.Invoice) {
    const user = await this.findUserByCustomer(this.getCustomerId(invoice));

    const invoiceAny = invoice as any;
    await this.paymentTransactionRepo.createTransaction({
      userId: user.id,
      stripeSubscriptionId:
        typeof invoiceAny.subscription === 'string'
          ? invoiceAny.subscription
          : invoiceAny.subscription?.id || null,
      stripeInvoiceId: invoice.id,
      stripeChargeId:
        typeof invoiceAny.charge === 'string'
          ? invoiceAny.charge
          : invoiceAny.charge?.id || null,
      stripePaymentIntentId:
        typeof invoiceAny.payment_intent === 'string'
          ? invoiceAny.payment_intent
          : invoiceAny.payment_intent?.id || null,
      amount: invoice.amount_due || 0,
      currency: invoice.currency || 'usd',
      status: 'failed',
      description: 'Failed invoice payment',
    });
  }

  private getCustomerId(obj: any): string {
    return typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
  }

  private async findUserByCustomer(customerId: string) {
    const user = await this.db.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      throw new BadRequestException(
        `User not found for customer: ${customerId}`,
      );
    }
    return user;
  }

  private extractPrice(subscription: Stripe.Subscription) {
    const item = subscription.items.data[0];
    return {
      priceId: item?.price?.id || null,
      productId:
        typeof item?.price?.product === 'string'
          ? item.price.product
          : item?.price?.product?.id || null,
    };
  }

  private async saveSubscription(params: {
    userId: string;
    subscription: Stripe.Subscription;
  }) {
    const { userId, subscription } = params;
    const { priceId, productId } = this.extractPrice(subscription);
    const start_date = subscription.start_date;
    const cancel_at = subscription.canceled_at || null;
    const interval =
      subscription?.items?.data[0]?.price?.recurring?.interval || 'month';
    const interval_count =
      subscription?.items?.data[0]?.price?.recurring?.interval_count || 1;
    const end_data = getNextBillingDate(
      interval,
      interval_count,
      new Date(start_date),
    );
    const status = mapStatus(subscription.status);

    if (!priceId) {
      throw new BadRequestException('Price ID not found in subscription');
    }

    const subscriptionData: Prisma.UserSubscriptionUncheckedCreateInput = {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: productId || null,
      status: status as any,
      currentPeriodStart: new Date(start_date),
      currentPeriodEnd: new Date(end_data),
      cancelAtPeriodEnd: cancel_at ? true : false,
    };

    await this.userSubscriptionRepo.createOrUpdate(subscriptionData);
  }
}

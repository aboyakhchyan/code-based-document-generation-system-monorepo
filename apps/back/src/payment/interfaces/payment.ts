import { IUser } from '@auth/interface';
import { TransactionStatus, SubscriptionStatus } from '@prisma/client';

export interface IPaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ISubscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeProductId?: string | null;
  status: SubscriptionStatus;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string | null;
  status: TransactionStatus;
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  stripeInvoiceId?: string | null;
  stripeSubscriptionId?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface IPaymentPlan {
  id: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
}

export interface IPaymentPlanWithDetails extends IPaymentPlan {
  name: string;
  description: string;
  savings?: number;
}

export type BillingPeriod = 'month' | 'year';

export type PaymentProvider = 'stripe' | 'paypal';

export interface IPaymentTransactionWithUser {
  id: string;
  amount: string;
  status: TransactionStatus;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

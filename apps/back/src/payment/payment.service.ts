import { BadRequestException, Injectable } from '@nestjs/common';
import { DEFAULT_CURRENCY, formatAmount, StripeService } from './stripe';
import { CreateCheckoutSessionDto } from './dto/checkout-session.dto';
import { IUser, UserRole } from '@auth/interface';
import { PaymentTransactionRepository } from './repositories';
import { PaymentTransaction } from '@prisma/client';
import { IPaymentTransactionWithUser } from './interfaces';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly transactionRepo: PaymentTransactionRepository,
  ) {}

  async initPayment(user: IUser, checkoutSessionDto: CreateCheckoutSessionDto) {
    const { provider, priceId } = checkoutSessionDto;

    switch (provider) {
      case 'stripe':
        return await this.stripeService.initPayment(user, priceId);
      default:
        throw new BadRequestException('Invalid payment provider');
    }
  }

  async getAllPlanDetails(provider: string) {
    switch (provider) {
      case 'stripe':
        return await this.stripeService.getAllPlanDetails();
      default:
        throw new BadRequestException('Invalid payment provider');
    }
  }

  async getPaymentHistory(user: IUser): Promise<IPaymentTransactionWithUser[]> {
    const { role, id } = user;

    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    let transactions: IPaymentTransactionWithUser[] = [];

    if (role === UserRole.ADMIN) {
      const allTransactions = await this.transactionRepo.findAllWithUser();

      transactions = allTransactions.map((transaction) => ({
        id: String(transaction.id),
        amount: formatAmount(
          transaction.amount,
          transaction.currency || DEFAULT_CURRENCY,
        ),
        status: transaction.status,
        createdAt: transaction.createdAt,
        user: {
          id: String(transaction.user.id),
          fullName: transaction.user.fullName,
          email: transaction.user.email,
        },
      }));
    } else if (role === UserRole.USER) {
      const userTransactions = await this.transactionRepo.findByUserId(id);

      transactions = userTransactions.map((transaction: any) => ({
        id: String(transaction.id),
        amount: formatAmount(
          transaction.amount,
          transaction.currency || DEFAULT_CURRENCY,
        ),
        status: transaction.status,
        createdAt: transaction.createdAt,
        user: {
          id: String(transaction.user.id),
          fullName: transaction.user.fullName,
          email: transaction.user.email,
        },
      }));
    }

    return transactions;
  }
}

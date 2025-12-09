import { Injectable } from '@nestjs/common';
import { PaymentTransaction, Prisma, TransactionStatus } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class PaymentTransactionRepository extends BaseRepository<PaymentTransaction> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'PaymentTransaction' as Prisma.ModelName);
    this.db = databaseService;
  }

  async findByUserId(userId: string) {
    return this.db.paymentTransaction.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            gender: true,
            age: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserIdAndStatus(userId: string, status: TransactionStatus) {
    return this.db.paymentTransaction.findMany({
      where: {
        userId,
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStripeInvoiceId(stripeInvoiceId: string) {
    return this.db.paymentTransaction.findFirst({
      where: {
        stripeInvoiceId,
      },
    });
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this.db.paymentTransaction.findMany({
      where: {
        stripeSubscriptionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createTransaction(
    data: Prisma.PaymentTransactionUncheckedCreateInput,
  ): Promise<PaymentTransaction> {
    return this.db.paymentTransaction.create({
      data,
    });
  }

  async findAllWithUser() {
    return this.db.paymentTransaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            gender: true,
            age: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma, SubscriptionStatus, UserSubscription } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class UserSubscriptionRepository extends BaseRepository<UserSubscription> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'UserSubscription' as Prisma.ModelName);
    this.db = databaseService;
  }

  async findByUserId(userId: string) {
    return this.db.userSubscription.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this.db.userSubscription.findFirst({
      where: {
        stripeSubscriptionId,
      },
      include: {
        user: true,
      },
    });
  }

  async findByStatus(status: SubscriptionStatus) {
    return this.db.userSubscription.findMany({
      where: {
        status,
      },
      include: {
        user: true,
      },
    });
  }

  async findActiveSubscriptions() {
    return this.db.userSubscription.findMany({
      where: {
        status: {
          in: ['active', 'trialing'],
        },
      },
      include: {
        user: true,
      },
    });
  }

  async updateByUserId(userId: string, data: Partial<UserSubscription>) {
    return this.db.userSubscription.update({
      where: {
        userId,
      },
      data,
    });
  }

  async updateByStripeSubscriptionId(
    stripeSubscriptionId: string,
    data: Partial<UserSubscription>,
  ) {
    return this.db.userSubscription.updateMany({
      where: {
        stripeSubscriptionId,
      },
      data,
    });
  }

  async createOrUpdate(
    subscription: Prisma.UserSubscriptionUncheckedCreateInput
  ) {

    return await this.db.userSubscription.upsert({
      where: { userId: subscription.userId },
      create: {
        userId: subscription.userId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
        stripeProductId: subscription.stripeProductId ?? null,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart ?? null,
        currentPeriodEnd: subscription.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
      },
      update: {
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
        stripeProductId: subscription.stripeProductId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
    });
  }
}

import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthRepository } from '@auth/auth.repository';
import { DatabaseModule, DatabaseService } from '@services/database';
import {
  PaymentTransactionRepository,
  UserSubscriptionRepository,
} from 'payment/repositories';

@Module({
  imports: [DatabaseModule],
  providers: [
    StripeService,
    DatabaseService,
    AuthRepository,
    UserSubscriptionRepository,
    PaymentTransactionRepository,
  ],
  exports: [StripeService],
})
export class StripeModule {}

import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { DatabaseModule, DatabaseService } from '@services';
import { PaymentTransactionRepository } from './repositories';

@Module({
  imports: [StripeModule, WebhookModule, DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService, DatabaseService, PaymentTransactionRepository],
  exports: [PaymentService],
})
export class PaymentModule {}

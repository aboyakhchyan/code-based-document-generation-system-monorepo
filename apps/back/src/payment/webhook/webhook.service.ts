import {
  BadRequestException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from 'payment/stripe';

@Injectable()
export class WebhookService {
  constructor(private readonly stripeService: StripeService) {}

  async handleStripe(req: RawBodyRequest<Request>, signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    const event = await this.stripeService.constructEvent(
      req.rawBody as Buffer,
      signature,
    );


    return await this.stripeService.handleWebhookEvents(event);
  }
}

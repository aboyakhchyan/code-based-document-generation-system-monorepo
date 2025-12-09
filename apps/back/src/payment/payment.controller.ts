import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentProvider } from './interfaces';
import { Auth } from '@common/decorators/method';
import { IUser } from '@auth/interface';
import { User } from '@common/decorators/param';
import { CreateCheckoutSessionDto } from './dto/checkout-session.dto';
import { ProviderDto } from './dto/provider.dto';
import { Verified } from '@common/decorators/method/verified.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('init')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async initPayment(
    @Body() checkoutSessionDto: CreateCheckoutSessionDto,
    @User() user: IUser,
  ) {
    return this.paymentService.initPayment(user, checkoutSessionDto);
  }

  @Get('plan-details')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async getAllPlanDetails(@Query('provider') provider: string) {
    return this.paymentService.getAllPlanDetails(provider);
  }

  @Get('history')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async getPaymentHistory(@User() user: IUser) {
    return this.paymentService.getPaymentHistory(user);
  }
}

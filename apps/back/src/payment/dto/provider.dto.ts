import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentProvider } from 'payment/interfaces';

export class ProviderDto {
  @IsString()
  @IsNotEmpty()
  provider: PaymentProvider;
}

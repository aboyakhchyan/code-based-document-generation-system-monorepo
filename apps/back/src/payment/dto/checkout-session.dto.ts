import { IsNotEmpty, IsString } from "class-validator";
import { ProviderDto } from "./provider.dto";

export class CreateCheckoutSessionDto extends ProviderDto {
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
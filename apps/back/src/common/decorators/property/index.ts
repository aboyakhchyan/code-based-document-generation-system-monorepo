import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

export const IsNonEmptyString = () => {
  return applyDecorators(IsString(), IsNotEmpty());
}

import { applyDecorators, UseGuards } from '@nestjs/common';
import { VerifiedGuard } from '@common/guards';

export const Verified = () => {
  return applyDecorators(UseGuards(VerifiedGuard));
};

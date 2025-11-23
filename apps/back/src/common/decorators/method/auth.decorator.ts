import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Auth = (type: 'jwt') => {
  return applyDecorators(UseGuards(AuthGuard(type)));
};

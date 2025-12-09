import { UserRole } from '@auth/interface';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role === UserRole.ADMIN) {
      return true;
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email verification required');
    }

    return true;
  }
}

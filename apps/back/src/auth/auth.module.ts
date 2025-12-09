import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtServiceModule } from '@services/jwt';
import { DatabaseModule } from '@services/database';
import { MulterModule } from '@nestjs/platform-express';
import { MulterService, EmailModule } from '@services';
import { EmailVerificationRepository } from './email-verification.repository';

@Module({
  imports: [DatabaseModule, JwtServiceModule, MulterModule, EmailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    EmailVerificationRepository,
    JwtStrategy,
    MulterService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

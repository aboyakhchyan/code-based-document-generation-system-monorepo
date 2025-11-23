import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtServiceModule } from '@services/jwt';
import { DatabaseModule } from '@services/database';

@Module({
  imports: [DatabaseModule, JwtServiceModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

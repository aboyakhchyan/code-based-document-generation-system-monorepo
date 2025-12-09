import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { DatabaseModule, MulterService } from '@services';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [DatabaseModule, MulterModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, MulterService],
})
export class UserModule {}

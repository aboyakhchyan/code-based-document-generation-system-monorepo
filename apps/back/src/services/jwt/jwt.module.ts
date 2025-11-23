import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import getJwtConfig from '@common/configs/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtServiceModule {}

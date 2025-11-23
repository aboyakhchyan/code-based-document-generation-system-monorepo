import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { envConfig, validationSchema } from '@common/configs';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { DocumentModule } from '@document/document.module';
import {
  JwtServiceModule,
  DatabaseModule,
  LoggerModule,
  MulterConfigModule,
} from '@services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validationSchema,
    }),
    DatabaseModule,
    LoggerModule,
    MulterConfigModule,
    JwtServiceModule,
    AuthModule,
    UserModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

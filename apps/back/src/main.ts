import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { IApiConfig, IClientConfig } from '@common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@common/filters';
import { CustomLogger } from '@services/logger/logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const logger = new CustomLogger();

  const configService = app.get(ConfigService);
  const api = configService.getOrThrow<IApiConfig>('api');
  const client = configService.getOrThrow<IClientConfig>('client');

  app.setGlobalPrefix(api.prefix);
  app.use(cookieParser());

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
    index: false,
  });
  app.enableCors({
    origin: [
      client.uri,
      'http://192.168.11.60:6600/',
      'http://app1.local:6600',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 3600,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter(new CustomLogger()));

  await app.listen(api.port, () => {
    logger.log(`Server is running in http://${api.host}:${api.port}`, 'Start');
  });
}
bootstrap();

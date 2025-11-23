import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { IApiConfig, IClientConfig } from '@common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@common/filters';
import { CustomLogger } from '@services/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new CustomLogger();

  const configService = app.get(ConfigService);
  const api = configService.getOrThrow<IApiConfig>('api');
  const client = configService.getOrThrow<IClientConfig>('client');

  app.setGlobalPrefix(api.prefix);
  app.use(cookieParser());
  app.enableCors({
    origin: [client.uri],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 3600,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(api.port, () => {
    logger.log(`Server is running in http://${api.host}:${api.port}`, 'Start');
  });
}
bootstrap();

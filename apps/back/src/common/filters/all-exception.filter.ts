import { IExceptionResponse } from '@common/interfaces';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomLogger } from '@services';
import { Request, Response } from 'express';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const serverError = {
      message: 'Internal server error',
      error: 'Server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };

    const response =
      exception instanceof HttpException
        ? (exception.getResponse() as IExceptionResponse)
        : serverError;

    const message = Array.isArray(response?.message)
      ? response.message[0]
      : response.message;

    if (exception instanceof Error) {
      this.logger.error(
        `endpoint: [${req.url}], message: [${exception.message}]`,
        'Exception',
      );
    }

    res.status(status).json({
      ...response,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { WinstonLoggerService } from './winston-logger.handler';
import { captureException } from '@sentry/node';
import { NodeEnvironment } from '@libs/shared/src';
import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';
import { I18nValidationException } from 'nestjs-i18n';

@Catch(HttpException, Error)
export class GlobalExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter {

  private readonly logger = new Logger(GlobalExceptionFilter.name);


  constructor(
    private readonly configService: ConfigService,
    private readonly winstonLogger: WinstonLoggerService,
    private readonly _httpAdapterHost: HttpAdapterHost
  ) {
    Sentry.init({ dsn: configService.get('SENTRY_DSN') });
    super(_httpAdapterHost.httpAdapter);
  }

  catch(exception: HttpException | Error | I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message

    this.logger.error(JSON.stringify(exception));


    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      details: {
        reason: exception.message,
        name: exception.name,
        errors: exception instanceof I18nValidationException ? exception.errors : null,
      }
    };

    if (this.configService.get("NODE_ENV") === NodeEnvironment.PRODUCTION) {
      this.logger.error(
        `HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`,
      );

      const log = {
        stack: exception.stack,
        url: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        headers: request.headers,
        userId: request.user ? request.user.userId : null,
      }

      this.winstonLogger.error(message, log)
    }

    if (status >= 500 && exception instanceof Error && this.configService.get("NODE_ENV") === NodeEnvironment.PRODUCTION) {
      captureException(exception);
    }

    return response.code(status).send(errorResponse);
  }


}


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
import { FastifyReply, FastifyRequest } from 'fastify';

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
    const response = ctx.getResponse() as FastifyReply;
    const request = ctx.getRequest() as FastifyRequest & { user: { userId: string } };

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message


    const isProduction = this.configService.get('NODE_ENV') === NodeEnvironment.PRODUCTION;

    if (isProduction) {
      captureException(exception);
    }

    if (exception instanceof I18nValidationException) {
      return super.catch(exception, host);
    }

    this.logger.error(`[${request.method}] ${request.url}`, exception.stack);

    this.winstonLogger.error(exception.message, {
      stack: exception.stack,
      url: request.url,
      method: request.method,
      body: request.body,
      query: request.query,
      headers: request.headers,
      userId: request.user ? request.user.userId : null,
    }
    );

    response.code(status).send({
      statusCode: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

}


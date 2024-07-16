import { NodeEnvironment } from '@libs/shared/src';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: FastifyRequest & { cookies: any }, res: FastifyReply, next: () => void) {


    if (process.env.NODE_ENV !== NodeEnvironment.DEVELOPMENT) next();

    this.logger.log(`Request...`);
    this.logger.log(`Method: ${req.method}`);
    this.logger.log(`Path: ${req.url}`);
    this.logger.log(`Query: ${JSON.stringify(req.query)}`);
    this.logger.log(`Body: ${JSON.stringify(req.body)}`);
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    this.logger.log(`Params: ${JSON.stringify(req.params)}`);
    this.logger.log(`Cookies: ${JSON.stringify(req.cookies)}`);
    this.logger.log(`IP: ${req.ip}`);

    next();
  }
}

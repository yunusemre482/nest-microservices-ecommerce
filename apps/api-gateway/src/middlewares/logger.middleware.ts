import { NodeEnvironment } from '@libs/shared/src';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {


    if (process.env.NODE_ENV !== NodeEnvironment.DEVELOPMENT) next();

    this.logger.log(`Request...`);
    this.logger.log(`Method: ${req.method}`);
    this.logger.log(`Path: ${req.url}`);
    next();
  }
}

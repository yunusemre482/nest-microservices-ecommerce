import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { NextFunction } from 'express';

@Injectable()
export class ProfilerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProfilerMiddleware.name);

  use(req: FastifyRequest, res: FastifyReply, next: NextFunction): void {
    const start = Date.now();
    res.raw.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
  }
}

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

const THRESHOLD = 200; // 200 ms

@Injectable()
export class ProfilerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProfilerMiddleware.name);

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const start = Date.now();

    res.on("finish", () => {
      const elapsed = Date.now() - start;
      
      if (elapsed > THRESHOLD) {
        this.logger.warn(`Slow request: ${req.method} ${req.url} ${elapsed}ms`);
      } else {
        this.logger.log(`Request: ${req.method} ${req.url} ${elapsed}ms`);
      }
    });

    next();
  }
}

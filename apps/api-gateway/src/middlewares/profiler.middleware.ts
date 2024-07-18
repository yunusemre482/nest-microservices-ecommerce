import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

const THRESHOLD = 200; // 200 ms

@Injectable()
export class ProfilerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProfilerMiddleware.name);

  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const start = Date.now();

    // Remove the assignment statement
    (req as any).originalUrl = req.url;

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

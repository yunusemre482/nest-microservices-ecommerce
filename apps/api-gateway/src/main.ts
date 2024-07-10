import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyRateLimit from "@fastify/rate-limit";

import { Logger } from "@nestjs/common";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const fastify = new FastifyAdapter({ logger: true });

  const config = {
    GATEWAY_PORT: process.env.GATEWAY_PORT || 3000,
    REDIS_URL: process.env.REDIS_URL || "localhost",
    REDIS_PORT: process.env.REDIS_PORT || 6379
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify
  );

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  await app.register(fastifyCompress, { encodings: ['gzip'] });
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(config.GATEWAY_PORT).then(() => {
    Logger.log(`API Gateway is running on: http://localhost:${config.GATEWAY_PORT}`);
  })
}
bootstrap();

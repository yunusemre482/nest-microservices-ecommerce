import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyRateLimit from "@fastify/rate-limit";

import { Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const fastify = new FastifyAdapter({
    logger: process.env.NODE_ENV === 'development' ? true : false,
    trustProxy: true
  });

  const configService = new ConfigService();



  const config = {
    GATEWAY_PORT: configService.get('PORT') || 3000,
    REDIS_URL: configService.get('REDIS_URL') || "localhost",
    REDIS_PORT: configService.get('REDIS_PORT') || 6379
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify
  );

  const globalPrefix = 'api';



  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

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

  const hostname = '0.0.0.0';

  await app.startAllMicroservices();
  await app.listen(config.GATEWAY_PORT, hostname);

  Logger.log(
    `Server running on http://localhost:${config.GATEWAY_PORT}/${globalPrefix}`,
    'Bootstrap',
  );
}
bootstrap();

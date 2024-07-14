import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';



import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";
import { NodeEnvironment } from '@libs/shared/src';

async function bootstrap() {

  const configService = new ConfigService();

  const fastify = new FastifyAdapter({
    logger: process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT ? true : false,
    trustProxy: true
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify
  );

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );


  await app.register(fastifyCompress, { encodings: ['gzip'] });
  await app.register(fastifyCookie, { secret: configService.get('COOKIE_SECRET') });
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });
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
  const PORT = configService.get<number>('PORT') as number ?? 3000;

  await app.startAllMicroservices();
  await app.listen(PORT, hostname);

  Logger.log(
    `🚀 Api gateway is running on: http://localhost:${PORT}/${globalPrefix}`
  );
}
bootstrap();

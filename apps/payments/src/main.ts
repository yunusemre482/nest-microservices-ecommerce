/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

export async function bootstrap() {

  const config = {
    REDIS_URL: process.env.REDIS_URL || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379
  }

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
    }
  });

  await app.listen().then(() => {
    Logger.log(`Payments Microservice is listening on redis://${config.REDIS_URL}:${config.REDIS_PORT}`);
  });

}

bootstrap();

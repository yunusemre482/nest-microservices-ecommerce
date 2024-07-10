/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {

  const config = {
    RQM_URL: process.env.RQM_URL || 'amqp://localhost:5672',
    USERS_APP_QUEUE_NAME: process.env.APP_QUEUE_NAME || 'users_queue',
    REDIS_URL: process.env.REDIS_URL || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.RQM_URL],
      queue: config.USERS_APP_QUEUE_NAME,
      queueOptions: {
        durable: false
      },
    },
  });

  await app.listen().then(() => {
    Logger.log(`Users Microservice is listening on redis://${config.RQM_URL}:${config.REDIS_PORT}`);
  });

}

bootstrap();

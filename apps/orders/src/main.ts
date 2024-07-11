/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ORDERS_SERVICE_QUEUE, USERS_SERVICE_QUEUE } from '@libs/constants/src';

const logger = new Logger('Main')



export async function bootstrap() {

  const configService = new ConfigService();

  const port = configService.get<number>('PORT') ?? 3004;
  const url = configService.get<string>('RABBIT_MQ_URI');
  const queue = configService.get<string>('RABBIT_MQ_ORDER_QUEUE') ?? ORDERS_SERVICE_QUEUE;

  logger.debug(`PORT: ${port}`);
  logger.debug(`RABBIT_MQ_URI: ${url}`);
  logger.debug(`RABBIT_MQ_ORDER_QUEUE: ${queue}`);

  const microServiceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: queue,
      queueOptions: {
        durable: true
      }
    }
  } as RmqOptions;

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(microServiceOptions);

  await app.startAllMicroservices();
  await app.listen(port)

  logger.log(`Orders microservice is running on: http://localhost:${port}`);
}

bootstrap();

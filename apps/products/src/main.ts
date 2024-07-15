/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PRODUCTS_SERVICE_QUEUE, RABBIT_MQ_DEFAULT_URL, USERS_SERVICE_QUEUE } from '@libs/constants/src';

const logger = new Logger('Main')



export async function bootstrap() {

  const configService = new ConfigService();

  const port = configService.get<number>('PORT') ?? 3003;
  const url = configService.get<string>('RABBIT_MQ_URI') ?? RABBIT_MQ_DEFAULT_URL;
  const queue = configService.get<string>('RABBIT_MQ_PRODUCT_QUEUE') ?? PRODUCTS_SERVICE_QUEUE;

  logger.debug(`PORT: ${port}`);
  logger.debug(`RABBIT_MQ_URI: ${url}`);
  logger.debug(`RABBIT_MQ_USER_QUEUE: ${queue}`);

  const microServiceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: queue,
      noAck: false, // NOTE : This is set to false to ensure that the message is not lost if the consumer crashes before processing the message.
      queueOptions: {
        durable: true
      }
    }
  } as RmqOptions;

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(microServiceOptions);

  await app.startAllMicroservices();
  await app.listen(port)

  logger.log(`Products microservice is running on: http://localhost:${port}`);
}

bootstrap();

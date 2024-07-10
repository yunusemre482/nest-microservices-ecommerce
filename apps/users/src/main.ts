/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('Main')





export async function bootstrap() {

  const port = new ConfigService().get('PORT') || 3005;

  const microServiceOptions = {
    transport: Transport.TCP,
    options: {
      host: '::',
      port: port
    }
  } as TcpOptions

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, microServiceOptions);

  await app.listen().then(() => {
    logger.log(`Users microservice is running on: http://localhost:${port}`);
  });

}

bootstrap();

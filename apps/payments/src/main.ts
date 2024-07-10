/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const PORT = parseInt(process.env.PORT as string, 10) || 3003

  Logger.log(`PORT: ${PORT}`);
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: PORT
    },
  });

  app.listen().then(() => {
    Logger.log(`Payments microservice is running on: http://localhost:${PORT}`);
  });

}

bootstrap();

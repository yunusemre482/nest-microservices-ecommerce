import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RabbitMqModule } from '@libs/common/src';
import { PRODUCTS_SERVICE, PRODUCTS_SERVICE_QUEUE } from '@libs/constants/src';

@Module({
  imports: [
    RabbitMqModule.register({
      name: PRODUCTS_SERVICE,
      queue: PRODUCTS_SERVICE_QUEUE
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }

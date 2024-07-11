import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RabbitMqModule } from '@libs/common/src';
import { ORDERS_SERVICE, ORDERS_SERVICE_QUEUE } from '@libs/constants/src';
@Module({
  imports: [
    RabbitMqModule.register({
      name: ORDERS_SERVICE,
      queue: ORDERS_SERVICE_QUEUE
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }

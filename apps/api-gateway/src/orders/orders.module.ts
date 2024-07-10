import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RabbitMqModule } from '@nest-microservices/common';
import { ORDERS_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    RabbitMqModule.register({ name: ORDERS_SERVICE }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }

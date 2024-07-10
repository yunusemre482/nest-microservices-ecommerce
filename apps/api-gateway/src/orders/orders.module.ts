import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_SERVICE } from '../constants/services.constant';
@Module({
  imports: [
    ClientsModule.register([{ name: ORDERS_SERVICE, transport: Transport.TCP }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }

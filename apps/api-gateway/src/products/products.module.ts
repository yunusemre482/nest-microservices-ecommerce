import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    ClientsModule.register([{ name: PRODUCTS_SERVICE, transport: Transport.TCP }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { RabbitMqModule } from '@nest-microservices/common';
import { PRODUCTS_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    RabbitMqModule.register({ name: PRODUCTS_SERVICE }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

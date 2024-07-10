import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RabbitMqModule } from '@nest-microservices/common';
import { PAYMENTS_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    RabbitMqModule.register({ name: PAYMENTS_SERVICE }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }

import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RabbitMqModule } from '@libs/common/src';
import { PAYMENTS_SERVICE, PAYMENTS_SERVICE_QUEUE} from '@libs/constants/src';
@Module({
  imports: [
    RabbitMqModule.register({
      name: PAYMENTS_SERVICE,
      queue: PAYMENTS_SERVICE_QUEUE
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }

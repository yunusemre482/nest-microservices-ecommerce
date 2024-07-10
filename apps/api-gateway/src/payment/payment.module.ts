import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '../constants/services.constant';
@Module({
  imports: [
    ClientsModule.register([{ name: PAYMENTS_SERVICE, transport: Transport.TCP }])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }

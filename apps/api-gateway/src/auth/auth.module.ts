import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RabbitMqModule } from '@libs/common/src';
import { AUTHENTICATION_SERVICE, AUTHENTICATION_SERVICE_QUEUE } from '@libs/constants/src';

@Module({
  imports: [
    RabbitMqModule.register({
      name: AUTHENTICATION_SERVICE,
      queue: AUTHENTICATION_SERVICE_QUEUE
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }

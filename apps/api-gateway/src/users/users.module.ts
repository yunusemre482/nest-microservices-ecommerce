import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RabbitMqModule } from '@libs/common/src';
import { USERS_SERVICE, USERS_SERVICE_QUEUE } from '@libs/constants/src';

@Module({
  imports: [
    RabbitMqModule.register({
      name: USERS_SERVICE,
      queue: USERS_SERVICE_QUEUE
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }

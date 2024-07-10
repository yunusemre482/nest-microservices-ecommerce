import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RabbitMqModule } from '@nest-microservices/common';
import { USERS_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    RabbitMqModule.register({ name: USERS_SERVICE }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }

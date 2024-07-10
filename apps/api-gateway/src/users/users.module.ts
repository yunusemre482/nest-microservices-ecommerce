import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from '../constants/services.constant';


@Module({
  imports: [
    ClientsModule.register([{
      name: USERS_SERVICE,
      transport: Transport.TCP,
      options: {
        port: 3005
      }
    }])
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }

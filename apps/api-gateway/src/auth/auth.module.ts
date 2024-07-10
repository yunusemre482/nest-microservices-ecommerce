import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTHENTICATION_SERVICE } from '../constants/services.constant';

@Module({
  imports: [
    ClientsModule.register([{ name: AUTHENTICATION_SERVICE, transport: Transport.TCP }])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }

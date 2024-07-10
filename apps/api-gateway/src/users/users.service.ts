import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { USERS_SERVICE } from '../constants/services.constant';


@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_SERVICE) private readonly client: ClientProxy
  ) { }

  public async getUsers() {
    return this.client.send({ cmd: 'get-users' }, {});
  }
}

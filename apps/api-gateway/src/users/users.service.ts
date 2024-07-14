import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { USERS_SERVICE } from '@libs/constants/src';
import { Observable } from 'rxjs';


@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) { }

  getUsers(): Observable<[]> {
    return this.userClient.send('getAllUsers', {});
  }

  createUser(user: any): Observable<object> {
    return this.userClient.send('createUser', user);
  }
}

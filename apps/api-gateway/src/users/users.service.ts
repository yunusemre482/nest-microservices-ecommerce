import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { USERS_SERVICE } from '@libs/constants/src';
import { Observable } from 'rxjs';
import { CreateUserDTO } from '@libs/shared/src/dtos/users/create-user.dto';



@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) { }

  getUsers(): Observable<[]> {
    this.logger.debug('Getting all users');

    return this.userClient.send('getAllUsers', {});
  }

  async createUser(user: CreateUserDTO): Promise<object> {
    this.logger.debug('Creating user');

    // sleep for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return  this.userClient.send('createUser', user);
  }
}

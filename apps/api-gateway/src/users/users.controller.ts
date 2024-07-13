import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: ['1', '2'],
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Get('')
  public async getUsers() {
    return this.usersService.getUsers();
  }

}

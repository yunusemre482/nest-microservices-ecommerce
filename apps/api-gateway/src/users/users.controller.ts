import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from "@libs/shared/src/dtos/users/create-user.dto";


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

  @Post('')
  public async createUser(@Body() user: CreateUserDTO) {
    return this.usersService.createUser(user);
  }


}

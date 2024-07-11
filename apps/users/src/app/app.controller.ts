import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern('getAllUsers')
  async findAllUsers(@Payload() payload: any): Promise<object[]> {

    this.logger.log('Picking findAllUsers request from queue', payload);

    return await this.appService.findAllUsers();
  }

}

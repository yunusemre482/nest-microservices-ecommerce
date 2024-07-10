import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getUsers() {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: ''
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: ''
      }
    ];

  }

}

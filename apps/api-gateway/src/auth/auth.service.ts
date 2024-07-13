import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {


  public async validateUser(username: string, password: string): Promise<any> {
    return {
      id: 1,
      username
    };
  }
}

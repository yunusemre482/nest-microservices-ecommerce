import { Injectable } from '@nestjs/common';
import { LoginDTO } from '@libs/shared/src/dtos/auth/login.dto';
import { RegisterDTO } from '@libs/shared/src/dtos/auth/register.dto';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }


  public async login(loginDto: LoginDTO) {
    return loginDto;
  }

  public async register(registerDto: RegisterDTO) {
    return registerDto;
  }

  public async forgotPassword(email: string) {
    return email;
  }

  public async resetPassword(token: string, password: string) {
    return { token, password };
  }

  public async verifyEmail(token: string) {
    return token;
  }

  public async changePassword(oldPassword: string, newPassword: string) {
    return { oldPassword, newPassword };
  }

  public async changeEmail(email: string) {
    return email;
  }

  public async changePhone(phone: string) {
    return phone;
  }

  public async changeUsername(username: string) {
    return username;
  }

  public async changeProfilePicture(profilePicture: string) {
    return profilePicture;
  }

}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const csrfToken = request.cookies['XSRF-TOKEN'];

    if (csrfToken && csrfToken === request.body._csrf) {
      return true;
    } else {
      throw new Error('Invalid CSRF token');
    }
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const csrfToken = request.cookies['XSRF-TOKEN'];

    if (csrfToken && csrfToken === request.body._csrf) {
      return true;
    } else {
      throw new Error('Invalid CSRF token');
    }
  }
}

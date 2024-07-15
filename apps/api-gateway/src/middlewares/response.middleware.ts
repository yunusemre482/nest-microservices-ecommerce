import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => ({
        path: context.switchToHttp().getRequest().url,
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        data: data ?? null,
        error: null,
      })),
    );
  }
}

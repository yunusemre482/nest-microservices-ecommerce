import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
// TODO - add this import from constants library 
//import { LAMBDA_API_KEY_HEADER } from '@/infrastructure/shared/constants/auth.constant';


@Injectable()
export class LambdaGuard implements CanActivate {
  constructor(
    private readonly TranslationService: unknown,
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();

    if (request.headers.accept !== 'text/event-stream') {
      return false;
    }

    // TODO - add redis service from common module here and uncomment the code below
    // if (request.headers[LAMBDA_API_KEY_HEADER] !== process.env.BUSINESS_LAMBDA_API_KEY) {
    //   throw new Error(this.TranslationService.t('main.invalidAPIKey'));
    // }
    return true;
  }
}

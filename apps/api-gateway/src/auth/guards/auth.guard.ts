import { FastifyRequest } from 'fastify';
import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// TODO - add redis service from common module here and uncomment the code below
@Injectable()
export class CustomAuthGuard extends AuthGuard("jwt") {
  readonly logger = new Logger(CustomAuthGuard.name);
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const isJwtVerified = await super.canActivate(context);

      if (!isJwtVerified) throw new UnauthorizedException();

      const req = context.switchToHttp().getRequest();
      const token = this.extractTokenFromRequest(req);


      const { userId } = req.user;
      this.logger.debug(`userId: ${userId}`);

      // const currentToken = await this.redisService.getAccessToken(userId);


      // if (currentToken !== token) {
      //   throw new UnauthorizedException(); // TODO : add internationalization message here
      // }

      return true;

    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        // throw new UnauthorizedException(this.translationService.t('main.invalidAccessToken'));
      }
    }

    return false;
  }


  private extractTokenFromRequest(req: FastifyRequest): string {
    // const token =
    //   req.headers[ACCESS_TOKEN_HEADER] ||
    //   req.headers[AUTHORIZATION_HEADER];

    // if (!token) {
    //   throw new UnauthorizedException(this.TranslationService.t('main.accessTokenExpected'));
    // }

    // const [type, extractedToken] = req.headers.authorization?.split(' ') ?? [];


    // if (!extractedToken || type !== 'Bearer') {
    //   throw new UnauthorizedException(this.TranslationService.t('main.invalidAccessToken'));
    // }

    // return extractedToken;

    return "";
  }

}

import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { ThrottlerRequest } from '@nestjs/throttler/dist/throttler.guard.interface';
//import { TranslationService } from '@/infrastructure/i18n/translation.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly REQUEST_LIMIT = 100; // Maximum number of requests
  private readonly TIME_WINDOW = 60; // Time window in seconds


  constructor(
    @InjectThrottlerOptions()
    protected readonly options: ThrottlerModuleOptions,
    @InjectThrottlerStorage()
    protected readonly storageService: ThrottlerStorage,

    //public translationService: TranslationService,
    public reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  protected getTracker(req: FastifyRequest & { ip: string; body: { phone: string } }): Promise<string> {

    return Promise.resolve(req?.body?.phone ?? req.ip);
  }

  protected generateKey(context: ExecutionContext, tracker: string, throttlerName: string): string {
    const req = context.switchToHttp().getRequest();
    return `${throttlerName}:${tracker}:${req.url}`;
  }

  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context, limit, ttl, throttler } = requestProps;

    const req = context.switchToHttp().getRequest();
    const tracker = await this.getTracker(req);


    const key = this.generateKey(context, tracker, throttler.name ?? 'default');

    const { totalHits } = await this.storageService.increment(
      key,
      ttl,
      this.REQUEST_LIMIT,
      this.TIME_WINDOW,
      throttler.name ?? 'default',
    );


    if (totalHits > limit) {
      throw new ThrottlerException('Too many requests');
      // TODO : add internationalization message here
      //throw new ThrottlerException(this.translationService.t('main.tooManyRequests'));
    }

    return true;
  }
}

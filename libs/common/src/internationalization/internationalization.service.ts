import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from './types/i18n.types';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class InternationalizationService {
  constructor(private readonly i18nService: I18nService<I18nTranslations>) { }

  t(key: PathImpl2<I18nTranslations>, options?: TranslateOptions): string {

    return this.i18nService.t(key, {
      lang: I18nContext.current()?.lang || 'en',
      ...options,
    });
  }
}

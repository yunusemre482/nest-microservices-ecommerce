import { Module } from '@nestjs/common';
import { InternationalizationService } from './internationalization.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';

console.log(path.join(__dirname.replace("dist", ""), '../../libs/common/src/internationalization'));

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE') ?? 'en',
        loaderOptions: {
          path: "./",
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [InternationalizationService]
})
export class InternationalizationModule { }

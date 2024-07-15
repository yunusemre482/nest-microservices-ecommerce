import { Module } from '@nestjs/common';
import { InternationalizationService } from './internationalization.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';

console.log(path.join(__dirname, "i18n/"));

@Module({
  imports: [
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('FALLBACK_LANGUAGE') ?? 'en',
        loaderOptions: {
          path: path.join(__dirname, "/src/i18n/"),
          watch: true,
        },
        logging: configService.get<string>('NODE_ENV') === 'development', // REVIEW: Is this necessary?
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['lang', "x-lang"] },
        { use: AcceptLanguageResolver, options: { matchType: 'strict' } },
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [InternationalizationService]
})
export class InternationalizationModule { }

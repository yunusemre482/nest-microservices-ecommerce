import { Module } from '@nestjs/common';
import { InternationalizationService } from './internationalization.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE') ?? 'en',
        loaderOptions: {
          path: path.join(__dirname, '../internationalization/'),
          watch: true,
        },
        typesOutputPath: path.join(__dirname, '../internationalization/types/i18n.types.ts'),
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

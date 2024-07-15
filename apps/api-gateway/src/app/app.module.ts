import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PaymentModule } from '../payment/payment.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GlobalResponseInterceptor } from '../middlewares/response.middleware';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { ProfilerMiddleware } from '../middlewares/profiler.middleware';
import { GlobalExceptionFilter } from '../middlewares/error.handler';
import { WinstonLoggerService } from '../middlewares/winston-logger.handler';
import { InternationalizationModule } from '@libs/common/src/internationalization/internationalization.module';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PaymentModule,
    OrdersModule,
    ProductsModule,
    InternationalizationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLoggerService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {

      provide: APP_FILTER,
      useFactory() {
        return new I18nValidationExceptionFilter({
          errorFormatter(errors) {
            return errors.map(({ property, constraints }) => {
              const key = Object.keys(constraints || {})[0];
              const error = constraints?.[key] || 'Invalid';
              return {
                property,
                error
              };
            });
          },
          responseBodyFormatter(host, exc, formattedErrors) {
            const response = exc.getResponse();
            const status = exc.getStatus();
            return {
              status,
              message: response,
              errors: formattedErrors
            };
          }
        })

      }
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProfilerMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

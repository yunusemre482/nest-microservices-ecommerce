import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationException } from 'nestjs-i18n';

interface IFormattedError {
  property: string;
  error: string;
}

@Catch(I18nValidationException)
export class CustomI18nValidationExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super({
      errorFormatter(errors) {
        return errors.map(({ property, constraints }) => {
          const key = Object.keys(constraints || {})[0];
          const error = constraints?.[key] || 'Invalid';
          return {
            property,
            error,
          } as IFormattedError;
        });
      },
      responseBodyFormatter(host: ArgumentsHost, exc: I18nValidationException, formattedErrors: IFormattedError[] | object) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();

        const errorResponse = {
          success: false,
          data: null,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: "Request validation failed, please check the errors object",
          errors: formattedErrors,
        };

        return errorResponse;

      },
    });
  }
}

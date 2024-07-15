import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { I18nTranslations } from '@libs/common/src/internationalization/types/i18n.types';
import { i18nValidationMessage } from 'nestjs-i18n';


export class CreateUserDTO {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING")
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
  })
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString({
    message: 'validation.IS_STRING'
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
  })
  role!: string;

  @IsString({
    message: 'validation.IS_STRING'
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
  })
  status!: string;

  @IsString({
    message: 'validation.IS_STRING'
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
  })
  firstName!: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING")
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY")
  })
  lastName!: string;

  @IsString({
    message: 'validation.IS_STRING'
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
  })
  phone!: string;
}

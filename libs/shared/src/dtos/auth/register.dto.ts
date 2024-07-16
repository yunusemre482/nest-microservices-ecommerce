import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { I18nTranslations } from '@libs/common/src/internationalization/types/i18n.types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CountryCode } from '../../enums/country-code.enum';


export class RegisterDTO {
  @IsString({ message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING") })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY") })
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING") })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY") })
  firstName!: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING") })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY") })
  lastName!: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>("validation.IS_STRING") })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY") })
  countryCode!: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>("validation.IS_NOT_EMPTY") })
  @IsPhoneNumber(CountryCode.TR, { message: i18nValidationMessage<I18nTranslations>("validation.IS_PHONE_NUMBER") })
  phone!: string;
}

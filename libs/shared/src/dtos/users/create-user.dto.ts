import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class CreateUserDTO {
  @IsString({
    message: 'validation.IS_STRING'
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
    message: 'validation.IS_STRING'
  })
  @IsNotEmpty({
    message: 'validation.IS_NOT_EMPTY'
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

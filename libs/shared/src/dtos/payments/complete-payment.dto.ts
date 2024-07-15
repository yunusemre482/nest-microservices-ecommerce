import { IsNotEmpty, IsString } from "class-validator";

export class CompletePaymentDTO {
  @IsString()
  @IsNotEmpty()
  paymentId!: string;

  @IsString()
  @IsNotEmpty()
  payerId!: string;
}

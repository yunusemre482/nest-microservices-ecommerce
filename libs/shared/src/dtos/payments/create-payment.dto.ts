import { IsNotEmpty, IsString } from "class-validator";

export class InitiatePaymentDTO {
  @IsString()
  @IsNotEmpty()
  orderId!: string;
}

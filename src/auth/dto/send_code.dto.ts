import { IsEmail, IsIn, IsNumberString, IsOptional, IsPhoneNumber, IsUUID, Length, ValidateIf } from "class-validator";
import { VerifyType } from "../auth.service";

export class SendCodeDto {
    @IsIn([VerifyType.EMAIL, VerifyType.SMS])
    type: VerifyType;

    @ValidateIf(o => o.type === VerifyType.EMAIL)
    @IsEmail()
    email?: string;

    @ValidateIf(o => o.type === VerifyType.SMS)
    @IsPhoneNumber('KR')
    phone?: string;
}
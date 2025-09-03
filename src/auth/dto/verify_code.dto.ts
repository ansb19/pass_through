import { IsEmail, IsIn, IsNumberString, IsPhoneNumber, IsUUID, Length, ValidateIf } from "class-validator";
import { VerifyType } from "../auth.service";

export class VerifyCodeDto {
    @ValidateIf(o => o.email !== undefined)
    @IsEmail()
    email?: string;

    @ValidateIf(o => o.phone !== undefined)
    @IsPhoneNumber('KR')
    phone?: string;

    @IsIn([VerifyType.EMAIL, VerifyType.SMS])
    type: VerifyType;

    @IsNumberString()
    @Length(6, 6)
    code: string;
}
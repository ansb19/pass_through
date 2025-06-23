import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    pin: string;

    @IsString()
    sms_code: string;

    @IsString()
    fingerprint_token: string;
}
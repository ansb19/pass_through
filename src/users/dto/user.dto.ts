import { Type } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Length, Matches, ValidateNested } from "class-validator";
import { EncryptionBundleDto } from "src/common/crypto/dto/encryption-bundle.dto";
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsPhoneNumber('KR')
    @Length(10, 20)
    phone: string;

    @IsString()
    @Length(3, 50)
    nickname: string;

    @IsString()
    @Length(8, 8)
    birth: string;

    @ValidateNested()
    @Type(() => EncryptionBundleDto)
    enc: EncryptionBundleDto;
}



export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class CheckDuplicateDto {
    @IsString()
    @IsIn(['email', 'phone', 'nickname' ], { message: 'type은 email, phone, nickname 중 하나여야 합니다.' })
    type: 'email' | 'phone' | 'nickname' ;

    @IsString()
    @IsNotEmpty({ message: 'value는 필수입니다.' })
    value: string;
}
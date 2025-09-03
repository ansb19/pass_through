import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// ✅ 공통 DeviceDto (base)
export class DeviceDto {
  @IsString()
  @IsNotEmpty({ message: 'device_id는 필수입니다.' })
  @MaxLength(255, { message: 'device_id는 최대 255자까지 가능합니다.' })
  device_id: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'device_name은 최대 255자까지 가능합니다.' })
  device_name?: string;

  @IsString()
  @IsOptional()
  public_key?: string;

  @IsString()
  @IsNotEmpty({ message: 'app_version은 필수입니다.' })
  @MaxLength(255, { message: 'app_version은 최대 255자까지 가능합니다.' })
  app_version: string;
}

// ✅ 등록 시 (그냥 DeviceDto 그대로 사용하면 됨)
export class RegisterDeviceDto extends DeviceDto {
  @IsUUID()
  @IsNotEmpty({ message: 'user_id는 필수입니다.' })
  user_id: string;
}

// ✅ 수정 시 (device_id는 변경 불가 → 제외, 나머지 optional)
export class UpdateDeviceDto extends PartialType(
  OmitType(DeviceDto, ['device_id'] as const),
) { }

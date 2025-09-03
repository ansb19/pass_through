// src/common/crypto/dto/encryption-bundle.dto.ts
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class EncryptionBundleDto {
    /** 알고리즘/버전은 길게 남겨서 마이그레이션 대비 */
    @IsString() @IsIn(['AES-GCM']) algo: 'AES-GCM';
    @IsString() @IsIn(['PBKDF2']) kdf: 'PBKDF2';
    @IsInt() @IsPositive() iterations: number;    // 예: 310000
    @IsString() @IsIn(['SHA-256', 'SHA-512']) digest: 'SHA-256' | 'SHA-512';
    @IsInt() @IsPositive() keyLength: number;     // 예: 32

    // 클라가 base64로 보내면 서버에서 Buffer로 변환해 bytea 저장 추천
    @IsString() @IsNotEmpty() ciphertext_b64: string;
    @IsString() @IsNotEmpty() salt_b64: string;   // 랜덤 salt
    @IsString() @IsNotEmpty() nonce_b64: string;  // IV
    @IsOptional() @IsString() version?: string;   // 스키마 버전 관리용
}

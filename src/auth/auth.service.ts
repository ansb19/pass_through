import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { SmsService } from 'src/sms/sms.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

export enum Expire {
  CERT_TTL = 60 * 5,   // 5분
  VERIFIED_TTL = 60 * 30,  // 30분
  FAIL_TTL = 60 * 10,      // 10분
  REFRESH_TTL = 60 * 60 * 24 * 7, // 7일 (RefreshToken)
}

export enum VerifyStatus {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  FAILED = 'failed',
}

export enum VerifyType {
  EMAIL = 'email',
  SMS = 'sms',
}

@Injectable()
export class AuthService {
  private readonly MAX_FAIL = 5;

  constructor(
    private readonly redis: RedisService,
    private readonly sms_service: SmsService,
    private readonly email_service: EmailService,
    private readonly jwtService: JwtService,
  ) { }

  /** 내부: 인증코드 생성 + Redis 저장 (TTL 포함) */
  private async generateAndStoreCode(key: string) {
    const code = String(randomInt(100000, 1000000)); // 6자리
    // ioredis: setex 또는 set(..., 'EX', ttl) 사용
    await this.redis.setex(key, Expire.CERT_TTL, code);
    return code;
  }

  /** 인증 코드 발송 */
  async sendCode(identifier: string, type: VerifyType): Promise<void> {
    const verifyKey = `${VerifyStatus.UNVERIFIED}:${type}:${identifier}`;
    const code = await this.generateAndStoreCode(verifyKey);

    if (type === VerifyType.EMAIL) {
      await this.email_service.sendMail(
        identifier,
        '[패스 스루] 이메일 인증 코드입니다.',
        `[패스 스루] 인증 코드: ${code}를 ${Expire.CERT_TTL / 60}분 내에 입력해주세요.`,
        `<p>인증 코드: <b>${code}</b> <br> ${Expire.CERT_TTL / 60}분 내에 입력해주세요.</p>`,
      );
      return;
    }

    if (type === VerifyType.SMS) {
      await this.sms_service.sendSMS(
        identifier,
        `[패스 스루] 인증 코드: ${code}를 ${Expire.CERT_TTL / 60}분 내에 입력해주세요.`,
      );
      return;
    }

    throw new UnauthorizedException('지원하지 않는 인증 타입입니다.');
  }

  /**
   * 인증 코드 검증
   * - 실패 5회 차단
   * - 성공 시 30분간 verified 상태 저장
   */
  async verifyCode(identifier: string, type: VerifyType, code: string): Promise<boolean> {
    const verifyKey = `${VerifyStatus.UNVERIFIED}:${type}:${identifier}`;
    const failKey = `${VerifyStatus.FAILED}:${type}:${identifier}`;
    const verifiedKey = `${VerifyStatus.VERIFIED}:${type}:${identifier}`;

    // 최대 실패 횟수 초과 여부
    const failCountStr = await this.redis.get(failKey);
    const failCount = failCountStr ? parseInt(failCountStr, 10) : 0;
    if (failCount >= this.MAX_FAIL) {
      return false; // 차단
    }

    // 저장된 코드 확인
    const storedCode = await this.redis.get(verifyKey);
    if (!storedCode) {
      return false; // 만료/없음
    }

    if (storedCode !== code) {
      // 실패 카운트 증가
      const newFails = await this.redis.incr(failKey);

      // 실패 키에 TTL 없으면(=첫 실패) FAIL_TTL 부여
      const ttl = await this.redis.ttl(failKey);
      if (ttl < 0) {
        await this.redis.expire(failKey, Expire.FAIL_TTL);
      }

      // 선택: 최대 실패 도달 시 코드 폐기
      if (newFails >= this.MAX_FAIL) {
        await this.redis.del(verifyKey);
      }
      return false;
    }

    // 성공: verified 표시 + 원코드/실패카운트 제거
    await this.redis.setex(verifiedKey, Expire.VERIFIED_TTL, 'true');
    await this.redis.del(verifyKey);
    await this.redis.del(failKey);
    return true;
  }

  /** 현재 verified 상태인지 조회 */
  async isVerified(type: VerifyType, identifier: string): Promise<boolean> {
    const key = `${VerifyStatus.VERIFIED}:${type}:${identifier}`;
    const verified = await this.redis.get(key);
    const isVerified = verified === 'true';
    if (isVerified) {
      await this.redis.del(key);
    }
    return isVerified;
  }

  /** enc 번들 내려주기 (PIN unwrap은 클라에서) */
  async getEncBundle(user: User) {
    return {
      algo: user.algo,
      kdf: user.kdf,
      digest: user.digest,
      iterations: user.iterations,
      key_length: user.key_length,
      version: user.schema_version,
      ciphertext_b64: user.encrypted_master_key.toString('base64'),
      salt_b64: user.salt.toString('base64'),
      nonce_b64: user.nonce.toString('base64'),
    };
  }


  /** 로그인 → AccessToken + RefreshToken 발급 */
  /** 토큰 발급 */
  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.redis.setex(
      `refresh:${user.id}`,
      Expire.REFRESH_TTL,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  /** 로그아웃 → RefreshToken 폐기 */
  async logout(userId: string) {
    const result = await this.redis.del(`refresh:${userId}`);
    if (!result) {
      throw new ConflictException('이미 로그아웃 되었거나 세션이 없습니다.');
    }
    return true;
  }

  /** RefreshToken으로 AccessToken 재발급 */
  async refresh(userId: string, refreshToken: string) {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('RefreshToken이 유효하지 않습니다.');
    }

    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken };
  }
}

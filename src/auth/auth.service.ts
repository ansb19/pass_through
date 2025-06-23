// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: SignupDto) {
    // 1. SMS 인증코드 검증 (서버에 저장된 코드와 비교) - 생략 (별도 구현 필요)
    
    // 2. 지문 인증 토큰 유효성 확인 - 생략 (외부 API와 연동 필요)

    // 3. PIN 해싱
    const hashed_pin = await bcrypt.hash(dto.pin, 10);

    // 4. 사용자 생성
    const user = await this.usersService.create({
      email: dto.email,
      hashed_pin,
      fingerprint_authed_token: dto.fingerprint_token,
    });

    return { message: 'Signup successful', userId: user.id };
  }
}

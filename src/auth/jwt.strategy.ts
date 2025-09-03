import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from 'src/config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: EnvConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
      ignoreExpiration: false, // 만료된 토큰 거절
      secretOrKey: config.JWT_SECRET || 'super-secret-key', // ✅ 환경변수에서 관리 권장
    });
  }

  /**
   * JWT payload 검증 후 반환되는 값이 req.user에 들어감
   */
  async validate(payload: any) {
    // payload는 토큰 생성 시 넣은 값 (ex: { sub: userId, email })
    return { id: payload.sub, email: payload.email };
  }
}

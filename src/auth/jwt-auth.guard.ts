import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// ✅ "jwt" 전략을 사용하는 Guard
export class JwtAuthGuard extends AuthGuard('jwt') {}

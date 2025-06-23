import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService){

  }
  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    req.session.user = {
      id: 1,
      email: 'user@example.com',
    };
    res.send('로그인 성공');
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) console.error('세션 제거 실패:', err);
      res.send('로그아웃 성공');
    });
  }

  @Post('signup')
  signup(@Body() dto: SignupDto){
    return this.auth_service.signup(dto);
  }
}
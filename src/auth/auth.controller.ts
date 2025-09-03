import { Controller, Post, Body, BadRequestException, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService, VerifyType } from './auth.service';
import { SendCodeDto } from './dto/send_code.dto';
import { VerifyCodeDto } from './dto/verify_code.dto';
import { UsersService } from 'src/users/users.service';
import { UserDevicesService } from 'src/users/user_devices.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly user_device_service: UserDevicesService,
  ) { }
  /**
   * 인증 코드 발송 (이메일 또는 휴대폰)
   */
  @Post('send-code')
  async sendCode(@Body() dto: SendCodeDto): Promise<{ success: boolean }> {

    const { type, email, phone } = dto;
    if (type === VerifyType.EMAIL && email) {
      await this.authService.sendCode(email, VerifyType.EMAIL);
    } else if (type === VerifyType.SMS && phone) {
      await this.authService.sendCode(phone, VerifyType.SMS);
    } else {
      throw new BadRequestException('type과 identifier가 일치하지 않습니다.');
    }
    return { success: true };
  }

  /**
   * 인증 코드 검증 (이메일 또는 휴대폰)
   */
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto): Promise<{ success: boolean }> {
    let identifier: string | undefined;
    if (dto.email) identifier = dto.email;
    else if (dto.phone) identifier = dto.phone;
    else return { success: false };
    const result = await this.authService.verifyCode(identifier, dto.type, dto.code);
    return { success: result };
  }

  /**
  * 로그인 1단계: enc 번들 내려주기
  * (PIN 검증은 클라이언트에서만 수행)
  */
  @Post('login-enc')
  async loginEnc(
    @Body('user_id') user_id: string,
    @Body('device_bind') device_bind: string,
  ) {
    if (!user_id || !device_bind) {
      throw new BadRequestException('user_id와 device_bind가 필요합니다.');
    }

    // PK(device_bind)로 UserDevice 조회
    const userDevice = await this.user_device_service.findById(device_bind);

    if (!userDevice || userDevice.user.id !== user_id) {
      throw new UnauthorizedException('UserDevice not valid');
    }

    const user = await this.usersService.findById(user_id);
    const enc = await this.authService.getEncBundle(user);

    return enc;
  }

  /**
   * 로그인 2단계: PIN unwrap 성공 후 토큰 발급
   */
  @Post('issue-token')
  async issueToken(@Body('user_id') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    return this.authService.login(user);
  }

  /**
   * RefreshToken으로 AccessToken 재발급
   */
  @Post('refresh')
  async refresh(@Body() body: { user_id: string; refreshToken: string }) {
    const { user_id, refreshToken } = body;
    if (!user_id || !refreshToken) {
      throw new BadRequestException('user_id와 refreshToken이 필요합니다.');
    }
    return this.authService.refresh(user_id, refreshToken);
  }

  /**
   * 로그아웃 → RefreshToken 폐기
   */
  @Post('logout')
  async logout(@Body('user_id') userId: string) {
    if (!userId) throw new BadRequestException('user_id가 필요합니다.');
    return this.authService.logout(userId);
  }
}

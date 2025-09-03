import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserDevicesService } from './user_devices.service';
import { RegisterDeviceDto, UpdateDeviceDto } from './dto/device.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('devices')

export class UserDevicesController {
  constructor(private readonly service: UserDevicesService) { }

  /**
   * 기기 등록
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDeviceDto) {
    return this.service.register(dto);
  }

  /**
   * 내 기기 조회 (1유저 1기기 정책이라 1개만 반환)
   */
  
  @Get()
  findMyDevice(@Req() req) {
    const userId = req.user.id;
    return this.service.findByUser(userId);
  }

  /**
   * 기기 삭제
   */
  
  @Delete(':device_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('device_id') device_id: string) {
    const userId = req.user.id;
    return this.service.remove(userId, device_id);
  }

  /**
   * 기기 정보 수정 (이름, public_key 갱신)
   */
  @Patch(':device_id')
  update(
    @Req() req,
    @Param('device_id') device_id: string,
    @Body() dto: UpdateDeviceDto,
  ) {
    const userId = req.user.id;
    return this.service.update(userId, device_id, dto);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CheckDuplicateDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * 회원가입
   * @param dto 
   * @returns 암호화 정보를 제외한 User 정보
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateUserDto) {
    return this.usersService.signUp(dto);
  }

  /**
   * 전체 회원 조회
   * @returns 암호화 정보를 제외한 User들 정보
   */
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * 특정 회원 조회
   * @param id 
   * @returns 암호화 정보를 제외한 User 정보
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * 회원 정보 수정
   * @param id 
   * @param dto 
   * @returns 암호화 정보를 제외한 User 정보
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto,) {
    return this.usersService.update(id, dto);
  }

  /**
   * 회원 삭제
   * @param id 
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  /**
 * 중복 확인
 * type: email | phone | nickname
 * value: 검사할 값
 */
  @Post('check-duplicate')
  @HttpCode(HttpStatus.OK)
  async checkDuplicate(@Body() dto: CheckDuplicateDto) {
    return this.usersService.checkDuplicate(dto.type, dto.value);
  }
}

// src/users/users.service.ts
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService, VerifyType } from 'src/auth/auth.service';

export type PublicUser = Omit<User,
  | 'encrypted_master_key'
  | 'salt'
  | 'nonce'
  | 'algo'
  | 'kdf'
  | 'digest'
  | 'iterations'
  | 'key_length'
  | 'schema_version'
>;

export type CheckDuplicate = 'nickname' | 'email' | 'phone';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user_repo: Repository<User>,
    private readonly authService: AuthService,
  ) { }

  /** 회원가입: 서버는 저장만 */
  async signUp(dto: CreateUserDto): Promise<PublicUser> {
    const { email, phone, nickname, birth, enc } = dto;

    // 1) 이메일/문자 인증 여부 확인
    const emailVerified = await this.authService.isVerified(VerifyType.EMAIL, email);
    if (!emailVerified) throw new ConflictException('이메일 인증이 필요합니다.');

    const phoneVerified = await this.authService.isVerified(VerifyType.SMS, phone);
    if (!phoneVerified) throw new ConflictException('휴대폰 인증이 필요합니다.');

    // 2) enc 번들 base64 → Buffer 변환
    const encrypted_master_key = Buffer.from(enc.ciphertext_b64, 'base64');
    const salt = Buffer.from(enc.salt_b64, 'base64');
    const nonce = Buffer.from(enc.nonce_b64, 'base64');

    const user = this.user_repo.create({
      email,
      phone,
      nickname,
      birth,
      encrypted_master_key,
      salt,
      nonce,
      algo: enc.algo,
      kdf: enc.kdf,
      digest: enc.digest,
      iterations: enc.iterations,
      key_length: enc.keyLength,
      schema_version: enc.version,

      is_email_verified: emailVerified,
      is_sms_verified: phoneVerified,
    });

    try {
      await this.user_repo.save(user);
    } catch (error: any) {
      // Pg: unique_violation = 23505
      if (error?.code === '23505') {
        // 어떤 키가 중복인지 메시지 보강(선택)
        const msg = error?.detail?.includes('email') ? '이메일' :
          error?.detail?.includes('phone') ? '휴대폰' :
            error?.detail?.includes('nickname') ? '닉네임' :
              '이메일/휴대폰/닉네임';
        throw new ConflictException(`${msg}이(가) 이미 존재합니다.`);
      }
      throw new InternalServerErrorException();
    }

    const { encrypted_master_key: _, salt: __, nonce: ___, algo, kdf, digest, iterations, key_length, schema_version, ...result } = user;
    return result;
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.user_repo.find();
    return users.map(({ encrypted_master_key, salt, nonce, algo, kdf, digest, iterations, key_length, schema_version, ...u }) => u);
  }

  // 유저의 기본 정보 조회
  async findOne(id: string): Promise<PublicUser> {
    const user = await this.user_repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('회원을 찾을 수 없습니다.');
    const { encrypted_master_key, salt, nonce, algo, kdf, digest, iterations, key_length, schema_version, ...result } = user;
    return result;
  }

  //유저의 모든정보 포함
  async findById(id: string): Promise<User> {
    const user = await this.user_repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('회원을 찾을 수 없습니다.');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    // nickname/phone/email 변경 같은 기본 정보만 수정 (암호화 번들은 별도 API 권장)
    const user = await this.user_repo.preload({ id, ...dto });
    if (!user) throw new NotFoundException('회원을 찾을 수 없습니다.');

    try {
      await this.user_repo.save(user);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('중복되는 값이 있습니다.');
      }
      throw new InternalServerErrorException();
    }

    const { encrypted_master_key, salt, nonce, algo, kdf, digest, iterations, key_length, schema_version, ...result } = user;
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.user_repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('회원을 찾을 수 없습니다.');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.user_repo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.user_repo.findOne({ where: { phone } });
  }

  async checkDuplicate(type: CheckDuplicate, value: string): Promise<{ isDuplicate: boolean }> {
    let where = {};
    if (type === 'email') where = { email: value };
    if (type === 'phone') where = { phone: value };
    if (type === 'nickname') where = { nickname: value };

    const exists = await this.user_repo.findOne({ where });
    return { isDuplicate: !!exists };
  }
}
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice } from './entities/user_device.entity';
import { RegisterDeviceDto } from './dto/device.dto';

@Injectable()
export class UserDevicesService {
    constructor(
        @InjectRepository(UserDevice)
        private readonly deviceRepo: Repository<UserDevice>,
    ) { }

    /**
     * 기기 등록 (1유저 1기기 정책)
     */
    async register(dto: RegisterDeviceDto): Promise<UserDevice> {
        const { user_id, device_id, device_name, public_key, app_version } = dto;

        // ✅ 이미 유저가 기기를 등록했는지 확인
        const existingForUser = await this.deviceRepo.findOne({
            where: { user: { id: user_id } },
        });
        if (existingForUser) {
            throw new ConflictException(
                '이미 등록된 기기가 있습니다. 교체하려면 기존 기기를 삭제하거나 교체 API를 사용하세요.',
            );
        }

        // ✅ 이미 다른 유저가 동일한 device_id 등록했는지 확인
        const existingDevice = await this.deviceRepo.findOne({
            where: { device_id },
        });
        if (existingDevice) {
            throw new ConflictException('이미 다른 계정에 등록된 기기입니다.');
        }

        const device = this.deviceRepo.create({
            user: { id: user_id } as any,
            device_id,
            device_name,
            public_key,
            app_version,
        });

        try {
            return await this.deviceRepo.save(device);
        } catch (error: any) {
            if (error.code === '23505') {
                throw new ConflictException('이미 등록된 기기입니다.');
            }
            throw new InternalServerErrorException('기기 등록에 실패하였습니다.');
        }
    }

    /**
     * 사용자 기기 조회 (1유저 1기기 정책 → 단일 반환)
     */
    async findByUser(userId: string): Promise<UserDevice | null> {
        return await this.deviceRepo.findOne({
            where: { user: { id: userId } },
        });
    }

    /**
 * 기기 PK(id)로 단일 기기 조회
 */
    async findById(id: string): Promise<UserDevice | null> {
        return await this.deviceRepo.findOne({
            where: { id },
            relations: ['user'], // user_id 검증에 필요하다면 관계도 불러오기
        });
    }

    /**
     * 기기 정보 수정 (device_name, public_key 갱신)
     */
    async update(
        userId: string,
        device_id: string,
        updateData: Partial<Pick<UserDevice, 'device_name' | 'public_key' | 'app_version'>>,
    ): Promise<UserDevice> {
        const device = await this.deviceRepo.findOne({
            where: { user: { id: userId }, device_id },
        });
        if (!device) {
            throw new NotFoundException('기기를 찾을 수 없습니다.');
        }

        Object.assign(device, updateData);

        try {
            return await this.deviceRepo.save(device);
        } catch (error) {
            throw new InternalServerErrorException('기기 수정에 실패하였습니다.');
        }
    }


    /**
     * 기기 삭제 (내 계정 기기만 삭제 가능)
     */
    async remove(userId: string, device_id: string): Promise<void> {
        const result = await this.deviceRepo.delete({
            user: { id: userId },
            device_id,
        });
        if (result.affected === 0) {
            throw new NotFoundException('기기를 찾을 수 없습니다.');
        }
    }

    /**
     * 기기 교체 (휴대폰 변경 시 device_id 갱신)
     * - 실제 서비스에서는 OTP/SMS/Email 인증 절차 후 호출해야 안전
     */
    async replaceDevice(
        userId: string,
        oldDeviceId: string,
        newDeviceId: string,
    ): Promise<UserDevice> {
        const device = await this.deviceRepo.findOne({
            where: { user: { id: userId }, device_id: oldDeviceId },
        });
        if (!device) {
            throw new NotFoundException('기기를 찾을 수 없습니다.');
        }

        // ✅ 보안: 여기서 추가 인증 절차(OTP, SMS 등) 확인 필요
        // ex) if (!verified) throw new ForbiddenException('추가 인증이 필요합니다.');

        // 새 기기 ID 중복 체크
        const existingDevice = await this.deviceRepo.findOne({
            where: { device_id: newDeviceId },
        });
        if (existingDevice) {
            throw new ConflictException('이미 다른 계정에 등록된 기기입니다.');
        }

        device.device_id = newDeviceId;

        try {
            return await this.deviceRepo.save(device);
        } catch (error) {
            throw new InternalServerErrorException('기기 교체에 실패하였습니다.');
        }
    }
}

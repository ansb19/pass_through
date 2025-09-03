import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    InvalidEnvironmentVariableError,
    MissingEnvironmentVariableError,
} from '../common/exceptions/env.error';


export enum DBType {
    POSTGRES = 'postgres',
    MYSQL = 'mysql',
}

@Injectable()
export class EnvConfig {
    constructor(private readonly configService: ConfigService) {
        // 필수 환경 변수 검증
        console.log('Initializing EnvConfig...');
    }

    // ====== 공통 getter 메서드 ======
    private getString(key: string): string {
        const value = this.configService.get<string>(key);
        if (value === undefined || value === null || value === '') {
            throw new MissingEnvironmentVariableError(key);
        }
        return value;
    }

    private getNumber(key: string, defaultValue?: number): number {
        const raw = this.configService.get<string>(key);
        const parsed = raw !== undefined ? parseInt(raw, 10) : defaultValue;
        if (isNaN(parsed!)) {
            throw new InvalidEnvironmentVariableError(key, 'number');
        }
        return parsed!;
    }

    // ====== General ======
    get NODE_ENV(): string {
        return this.getString('NODE_ENV');
    }

    get NODE_NETWORK(): string {
        return this.getString('NODE_NETWORK');
    }

    get PORT(): number {
        return this.getNumber('PORT', 3000);
    }

    //* database
    get DB_TYPE(): string {
        return this.getString('DB_TYPE');
    }
    get DB_HOST(): string {
        return this.getString('DB_HOST');
    }
    get DB_PORT(): number {
        return this.getNumber('DB_PORT');
    }
    get DB_USERNAME(): string {
        return this.getString('DB_USERNAME');
    }
    get DB_PASSWORD(): string {
        return this.getString('DB_PASSWORD');
    }
    get DB_NAME(): string {
        return this.getString('DB_NAME');
    }

    get REDIS_REMOTE(): string {
        return this.getString('REDIS_REMOTE');
    }
    get REDIS_LOCAL(): string {
        return this.getString('REDIS_LOCAL');
    }
    get REDIS_PORT(): number {
        return this.getNumber('REDIS_PORT');
    }
    get REDIS_PASSWORD(): string {
        return this.getString('REDIS_PASSWORD');
    }

    get SESSION_SECRET(): string {
        return this.getString('SESSION_SECRET');
    }

    get EMAIL_SERVICE(): string {
        return this.getString('EMAIL_SERVICE');
    }
    get EMAIL_HOST(): string {
        return this.getString('EMAIL_HOST');
    }
    get EMAIL_PORT(): number {
        return this.getNumber('EMAIL_PORT');
    }
    get EMAIL_USER(): string {
        return this.getString('EMAIL_USER');
    }
    get EMAIL_PASSWORD(): string {
        return this.getString('EMAIL_PASSWORD');
    }

    get SMS_API_KEY(): string {
        return this.getString('SMS_API_KEY');
    }
    get SMS_API_SECRET(): string {
        return this.getString('SMS_API_SECRET');
    }
    get SENDER_PHONE(): string {
        return this.getString('SENDER_PHONE');
    }

    get ALIGO_API_KEY(): string {
        return this.getString('ALIGO_API_KEY');
    }

    get ALIGO_USER_ID(): string {
        return this.getString('ALIGO_USER_ID');
    }

    get JWT_SECRET(): string {
        return this.getString('JWT_SECRET');
    }
}
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class CacheService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    /**
  * 토큰 저장 (ex. QR 토큰, OTP, 세션 토큰 등)
  */
    async setToken(key: string, value: string, ttl = 300): Promise<void> {
        await this.redis.set(key, value, 'EX', ttl); // TTL 단위는 초
    }

    /**
     * 토큰 조회
     */
    async getToken(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    /**
     * 토큰 삭제
     */
    async deleteToken(key: string): Promise<void> {
        await this.redis.del(key);
    }

    /**
     * 카운터 증가 (예: 로그인 실패 횟수)
     */
    async increment(key: string): Promise<number> {
        return await this.redis.incr(key);
    }

    /**
     * TTL 설정 (예: 제한 시간 초기화)
     */
    async expire(key: string, seconds: number): Promise<number> {
        return await this.redis.expire(key, seconds);
    }
}
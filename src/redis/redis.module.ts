// redis.module.ts
import { Module } from '@nestjs/common';
// ✅ 여기의 ConfigModule은 너의 커스텀 모듈 경로
import { ConfigModule } from 'src/config/config.module';
import { RedisService } from './redis.service';

@Module({
    imports: [ConfigModule],          // ✅ EnvConfig를 이 모듈에서 “가져오기”
    providers: [RedisService],        // ❌ EnvConfig를 여기서 다시 providers에 넣지 말기
    exports: [RedisService],
})
export class RedisModule { }
// 
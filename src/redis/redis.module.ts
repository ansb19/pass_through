import { Module } from "@nestjs/common";
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { EnvConfig } from '../config/env.config';

@Module({
    imports: [
        IORedisModule.forRootAsync({
            inject: [EnvConfig],
            useFactory: (config: EnvConfig) => ({
                type: 'single',
                options: {
                    host: config.NODE_NETWORK === 'localhost' 
                    ? config.REDIS_LOCAL
                    : config.REDIS_REMOTE,
                    port: config.REDIS_PORT,
                    password: config.REDIS_PASSWORD,
                },
            }),
        })
    ],
    exports: [IORedisModule],
})

export class RedisModule {}
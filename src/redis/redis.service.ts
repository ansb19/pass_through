// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvConfig } from 'src/config/env.config';


@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly cfg: EnvConfig) {
    super({
      host: cfg.NODE_NETWORK === 'localhost' ? cfg.REDIS_LOCAL : cfg.REDIS_REMOTE,
      port: cfg.REDIS_PORT,
      password: cfg.REDIS_PASSWORD,
      lazyConnect: true,
    });
  }
  async onModuleInit() { await this.connect(); }
  async onModuleDestroy() { await this.quit(); }
}

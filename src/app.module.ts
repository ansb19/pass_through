import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { DBType, EnvConfig } from './config/env.config';
import { RedisModule } from './redis/redis.module';


@Module({
  imports:[
      ConfigModule,
      RedisModule,
      TypeOrmModule.forRootAsync({
        inject: [EnvConfig],
        useFactory: (config: EnvConfig) => ({
          type: config.DB_TYPE as DBType, // 'postgres' 문자열
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USERNAME,
          password: config.DB_PASSWORD,
          database: config.DB_NAME,
          synchronize: config.NODE_ENV !== 'production', // 운영 배포 시 false
          logging: config.NODE_ENV !== 'production',
          autoLoadEntities: true, // entity 자동 로딩
        }),
      }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

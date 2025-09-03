import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { DBType, EnvConfig } from './config/env.config';
import { RedisModule } from './redis/redis.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { CryptoModule } from './common/crypto/crypto.module';
import { VaultModule } from './vault/vault.module';
import { ShareModule } from './share/share.module';
import { FriendModule } from './friend/friend.module';
import { SupportModule } from './support/support.module';


@Module({
  imports: [
    ConfigModule,
    RedisModule,
    TypeOrmModule.forRootAsync({
       imports: [ConfigModule],
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
    UsersModule,
    CoreModule,
    AuthModule,
    CommonModule,
    CryptoModule,
    VaultModule,
    ShareModule,
    FriendModule,
    SupportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import { EnvConfig } from '../src/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(EnvConfig);


  const redis_client = new Redis({
    host: config.NODE_NETWORK == 'localhost'
      ? config.REDIS_LOCAL
      : config.REDIS_REMOTE,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis_client,
        prefix: "session:",
        ttl: 60 * 60 * 2, // 2시간
      }),
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 2, // 2tlrks
      },
    }),
  );

  await app.listen(config.PORT);
}
bootstrap();

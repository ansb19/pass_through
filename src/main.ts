// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config/env.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,   // 초기 로그 누락 방지
    });

    const config = app.get(EnvConfig);

    // 로거 레벨
    app.useLogger(
      config.NODE_NETWORK === 'localhost'
        ? ['error', 'warn', 'log', 'debug']
        : ['error'],
    );

    // 글로벌 파이프(DTO 안전)
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // (선택) 글로벌 프리픽스
    // app.setGlobalPrefix('api');

    // 서버 리슨
    const port = Number(config.PORT ?? 3000);
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Listening on ${await app.getUrl()}`);
  } catch (error) {
    console.error('❌ Fatal bootstrap error:', error);
    process.exit(1);
  }
}
bootstrap();

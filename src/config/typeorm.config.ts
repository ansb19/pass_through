// src/config/typeorm.config.ts
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserDevice } from '../users/entities/user_device.entity';
import 'dotenv/config';
// 필요 엔티티들 import



export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, UserDevice],
  migrations: [process.env.NODE_ENV === 'production'
    ? 'dist/migrations/*.js'
    : 'src/migrations/*.ts'],
  synchronize: false, // 절대 true 쓰지 말 것(운영 DB 파괴 위험)
});

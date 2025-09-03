// src/users/entities/user.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
@Index(['nickname'], { unique: true })
@Index(['birth'])
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ length: 100 })
   email: string;

   @Column({ length: 20 })
   phone: string;

   @Column({ length: 50 })
   nickname: string;

   @Column({ length: 8 })
   birth: string;

   // === 암호화 번들 (서버는 저장만) ===
   @Column({ type: 'bytea' })  // ciphertext (Buffer)
   encrypted_master_key: Buffer;

   @Column({ type: 'bytea' })  // salt (Buffer)
   salt: Buffer;

   @Column({ type: 'bytea' })  // nonce/iv (Buffer)
   nonce: Buffer;

   // 메타
   @Column({ length: 16, default: 'AES-GCM' })
   algo: string;

   @Column({ length: 16, default: 'PBKDF2' })
   kdf: string;

   @Column({ length: 16, default: 'SHA-256' })
   digest: string;

   @Column({ type: 'int', default: 310000 })
   iterations: number;

   @Column({ type: 'int', default: 32 })
   key_length: number;

   @Column({ length: 16, nullable: true })
   schema_version?: string;

   @Column({ default: false })
   is_email_verified: boolean;

   @Column({ default: false })
   is_sms_verified: boolean;

   @CreateDateColumn({ type: 'timestamptz' })
   created_at: Date;

   @UpdateDateColumn({ type: 'timestamptz' })
   updated_at: Date;
}

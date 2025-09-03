// src/users/entities/user-device.entity.ts
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_device')
export class UserDevice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    @Index({ unique: true }) // ✅ 한 유저당 하나의 기기만 허용
    user: User;

    @Column({ length: 255 })
    @Index({ unique: true })
    device_id: string;  // OS가 제공하는 UUID 같은 고유값
    

    @Column({ length: 255, nullable: true })
    device_name?: string;

    @Column({ type: 'text', nullable: true })
    public_key?: string;

    @CreateDateColumn({ type: 'timestamptz' })
    registered_at: Date;

    @Column({ length: 255 })
    app_version: string;
}

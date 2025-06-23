import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    email:string;

    @Column()
    hashed_pin: string;

    @Column({nullable: true})
    fingerprint_authed_token: string;
}
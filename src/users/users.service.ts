import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) { }

    async create(data: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    async find_by_email(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }
}
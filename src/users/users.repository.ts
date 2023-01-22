import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/role.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly userEntityRepository: Repository<User>,
    ) {}

    public async getByEmail(email: string): Promise<User> {
        return await this.userEntityRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async getById(id: number): Promise<User> {
        return await this.userEntityRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async getAll(): Promise<User[]> {
        return await this.userEntityRepository.find();
    }

    public async create(dto: CreateUserDto, role: Role): Promise<User> {
        const user = await this.userEntityRepository.create({
            ...dto,
            role,
        });

        return user.save();
    }

    public async update(id: number, dto: UpdateUserDto, role: Role): Promise<User> {
        const user = await this.userEntityRepository.preload({
            id,
            ...dto,
            role,
        });

        return user.save();
    }
}

interface IUsersRepository {
    create(dto: CreateUserDto, role: Role): Promise<User>;
    getAll(): Promise<User[]>;
    getByEmail(email: string): Promise<User>;
    getById(id: number): Promise<User>;
    update(id: number, dto: CreateUserDto, role: Role): Promise<User>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryParamsDTO } from "../common/dto/query-params.dto";
import { User } from "./entities/user.entity";

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

    public getAllQ(): SelectQueryBuilder<User> {
        const userQuery = this.userEntityRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role");

        return userQuery;
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

        return await this.userEntityRepository.save(user);
    }

    public async deleteById(id: number): Promise<void> {
        await this.userEntityRepository.delete(id);

        return;
    }

    public async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
        // NOTE: update() does not trigger the @beforeUpdate() hook
        await this.userEntityRepository.update({ id }, { refreshToken });
    }
}

interface IUsersRepository {
    create(dto: CreateUserDto, role: Role): Promise<User>;
    deleteById(id: number): Promise<void>;
    getAllQ(queryParams: QueryParamsDTO): SelectQueryBuilder<User>;
    getByEmail(email: string): Promise<User>;
    getById(id: number): Promise<User>;
    update(id: number, dto: CreateUserDto, role: Role): Promise<User>;
    updateRefreshToken(id: number, refreshToken: string | null): Promise<void>;
}

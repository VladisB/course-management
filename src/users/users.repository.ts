import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryParamsDTO } from "../common/dto/query-params.dto";
import { User } from "./entities/user.entity";
import { BaseRepository } from "src/common/db/base.repository";
import { BaseErrorMessages } from "src/common/db/enum";

@Injectable()
export class UsersRepository extends BaseRepository implements IUsersRepository {
    private readonly tableName = "user";

    constructor(
        @InjectRepository(User)
        private readonly entityRepository: Repository<User>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async getByEmail(email: string): Promise<User> {
        return await this.entityRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async getById(id: number): Promise<User> {
        if (!id) return null;

        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                role: true,
            },
        });
    }

    public async getByIdAndRole(id: number, role: Role): Promise<User> {
        if (!id) return null;

        return await this.entityRepository.findOne({
            where: {
                id,
                role: { id: role.id },
            },
            relations: {
                role: true,
            },
        });
    }

    public async getByIdList(idList: number[], role: Role): Promise<User[]> {
        return await this.entityRepository.find({
            where: {
                id: In(idList),
                role: { id: role.id },
            },
            relations: {
                role: true,
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<User> {
        const userQuery = this.entityRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role");

        return userQuery;
    }

    public async create(dto: CreateUserDto, role: Role): Promise<User> {
        const user = await this.entityRepository.create({
            ...dto,
            role,
        });

        return user.save();
    }

    public async update(id: number, dto: UpdateUserDto, role: Role): Promise<User> {
        const user = await this.entityRepository.preload({
            id,
            ...dto,
            role,
        });

        return await this.entityRepository.save(user);
    }

    public async trxUpdate(
        queryRunner: QueryRunner,
        id: number,
        dto: UpdateUserDto,
        role: Role,
    ): Promise<User> {
        try {
            const entity = await this.entityRepository.preload({
                id,
                ...dto,
                role,
            });

            const newEntity = await queryRunner.manager.save(entity);

            return newEntity;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }

    public async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
        // NOTE: update() does not trigger the @beforeUpdate() hook
        await this.entityRepository.update({ id }, { refreshToken });
    }
}

interface IUsersRepository {
    create(dto: CreateUserDto, role: Role): Promise<User>;
    deleteById(id: number): Promise<void>;
    getAllQ(queryParams: QueryParamsDTO): SelectQueryBuilder<User>;
    getByEmail(email: string): Promise<User>;
    getById(id: number): Promise<User>;
    getByIdAndRole(id: number, role: Role): Promise<User>;
    getByIdList(idList: number[], role: Role): Promise<User[]>;
    trxUpdate(queryRunner: QueryRunner, id: number, dto: UpdateUserDto, role: Role): Promise<User>;
    update(id: number, dto: CreateUserDto, role: Role): Promise<User>;
    updateRefreshToken(id: number, refreshToken: string | null): Promise<void>;
}

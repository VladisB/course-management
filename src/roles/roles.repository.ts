import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { Role } from "src/roles/entities/role.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesRepository extends BaseRepository implements IRolesRepository {
    constructor(
        @InjectRepository(Role)
        private readonly entityRepository: Repository<Role>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public async getByName(name: string): Promise<Role> {
        return await this.entityRepository.findOne({ where: { name } });
    }

    public async getById(id: number): Promise<Role> {
        return await this.entityRepository.findOneBy({ id });
    }

    public getAllQ(): SelectQueryBuilder<Role> {
        const roleQuery = this.entityRepository.createQueryBuilder("role");

        return roleQuery;
    }

    public async create(dto: CreateRoleDto): Promise<Role> {
        const role = this.entityRepository.create(dto);

        return await this.entityRepository.save(role);
    }

    public async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        const role = await this.entityRepository.preload({
            id,
            ...dto,
        });

        return await this.entityRepository.save(role);
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }
}

export abstract class IRolesRepository extends IBaseRepository {
    abstract create(dto: CreateRoleDto): Promise<Role>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Role>;
    abstract getById(id: number): Promise<Role>;
    abstract getByName(name: string): Promise<Role>;
    abstract update(id: number, dto: UpdateRoleDto): Promise<Role>;
}

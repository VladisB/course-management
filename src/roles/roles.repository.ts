import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { Role } from "src/roles/entities/role.entity";
import { Repository, SelectQueryBuilder } from "typeorm";

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

    public async create(entity: Role): Promise<Role> {
        return await this.entityRepository.save(entity);
    }

    public async update(entity: Role): Promise<Role> {
        return await this.entityRepository.save(entity);
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }
}

export abstract class IRolesRepository extends IBaseRepository {
    abstract create(entity: Role): Promise<Role>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Role>;
    abstract getById(id: number): Promise<Role>;
    abstract getByName(name: string): Promise<Role>;
    abstract update(entity: Role): Promise<Role>;
}

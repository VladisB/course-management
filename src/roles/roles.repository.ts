import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RolesRepository implements IRolesRepository {
    constructor(
        @InjectRepository(Role)
        private readonly roleEntityRepository: Repository<Role>,
    ) {}

    public async getByName(name: string): Promise<Role> {
        return await this.roleEntityRepository.findOne({ where: { name } });
    }
    public async getById(id: number): Promise<Role> {
        return await this.roleEntityRepository.findOneBy({ id });
    }
    public getAllQ(): SelectQueryBuilder<Role> {
        const userQuery = this.roleEntityRepository.createQueryBuilder("role");

        return userQuery;
    }

    public async create(dto: CreateRoleDto): Promise<Role> {
        const role = this.roleEntityRepository.create(dto);

        return await this.roleEntityRepository.save(role);
    }
}

interface IRolesRepository {
    create(dto: CreateRoleDto): Promise<Role>;
    getByName(name: string): Promise<Role>;
    getById(id: number): Promise<Role>;
    getAllQ(): SelectQueryBuilder<Role>;
}

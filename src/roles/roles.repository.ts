import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

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
        const roleQuery = this.roleEntityRepository.createQueryBuilder("role");

        return roleQuery;
    }

    public async create(dto: CreateRoleDto): Promise<Role> {
        const role = this.roleEntityRepository.create(dto);

        return await this.roleEntityRepository.save(role);
    }

    public async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        const role = await this.roleEntityRepository.preload({
            id,
            ...dto,
        });

        return await this.roleEntityRepository.save(role);
    }

    public async deleteById(id: number): Promise<void> {
        await this.roleEntityRepository.delete(id);

        return;
    }
}

interface IRolesRepository {
    create(dto: CreateRoleDto): Promise<Role>;
    deleteById(id: number): Promise<void>;
    getAllQ(): SelectQueryBuilder<Role>;
    getById(id: number): Promise<Role>;
    getByName(name: string): Promise<Role>;
    update(id: number, dto: UpdateRoleDto): Promise<Role>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/role.entity";
import { Repository } from "typeorm";
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
    public async getAll(): Promise<Role[]> {
        return await this.roleEntityRepository.find();
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
    getAll(): Promise<Role[]>;
}

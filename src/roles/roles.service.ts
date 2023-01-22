import { ConflictException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";
import { RolesRepository } from "./roles.repository";

@Injectable()
export class RolesService implements IRolesService {
    constructor(private readonly roleRepository: RolesRepository) {}

    //#region Public methods

    public async createRole(dto: CreateRoleDto): Promise<Role> {
        await this.validateCreate(dto);

        return await this.roleRepository.create(dto);
    }

    public async getRoleByName(name: string): Promise<Role> {
        return await this.roleRepository.getByName(name);
    }

    public async getRoleById(id: number): Promise<Role> {
        return await this.roleRepository.getById(id);
    }

    public async getRoles(): Promise<Role[]> {
        // TODO: Add pagination, sorting, filtering, etc.
        return await this.roleRepository.getAll();
    }

    //#endregion

    //#region Private methods

    private async validateCreate(dto: CreateRoleDto): Promise<void> {
        await this.checkifExist(dto);
    }

    private async checkifExist(dto: CreateRoleDto): Promise<void> {
        const role = await this.roleRepository.getByName(dto.name);

        if (role) throw new ConflictException(`Role with name ${dto.name} already exists.`);
    }

    //#endregion
}

interface IRolesService {
    createRole(dto: CreateRoleDto): Promise<Role>;
    getRoleByName(name: string): Promise<Role>;
    getRoleById(id: number): Promise<Role>;
    getRoles(): Promise<Role[]>;
}

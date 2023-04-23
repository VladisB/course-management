import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { RolesViewModelFactory } from "./model-factories/roles.vm-factory";
import { IRolesRepository } from "./roles.repository";
import { RoleViewModel } from "./view-models";

@Injectable()
export class RolesService implements IRolesService {
    constructor(
        private readonly rolesRepository: IRolesRepository,
        private readonly rolesViewModelFactory: RolesViewModelFactory,
    ) {}

    //#region Public methods

    public async createRole(dto: CreateRoleDto): Promise<Role> {
        await this.validateCreate(dto);

        return await this.rolesRepository.create(dto);
    }

    public async getRoleByName(name: string): Promise<Role> {
        return await this.rolesRepository.getByName(name);
    }

    public async getRole(id: number): Promise<RoleViewModel> {
        const role = await this.rolesRepository.getById(id);

        if (!role) throw new NotFoundException(`Role not found.`);

        return this.rolesViewModelFactory.initRoleViewModel(role);
    }

    public async getRoles(queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>> {
        const query = this.rolesRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "role",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "role",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };

        const [roles, count] = await ApplyToQueryExtension.applyToQuery<Role>(
            queryParams,
            query,
            config,
        );

        const model = this.rolesViewModelFactory.initRoleListViewModel(roles);

        return new DataListResponse<RoleViewModel>(model, count);
    }

    public async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleViewModel> {
        await this.validateUpdate(id, updateRoleDto);

        const model = await this.rolesRepository.update(id, updateRoleDto);

        return this.rolesViewModelFactory.initRoleViewModel(model);
    }

    public async deleteRole(id: number): Promise<void> {
        const role = await this.validateDelete(id);

        await this.rolesRepository.deleteById(role.id);
    }

    //#endregion

    //#region Private methods

    private async validateCreate(dto: CreateRoleDto): Promise<void> {
        await this.checkifNotExistByName(dto.name);
    }

    private async validateUpdate(id: number, dto: UpdateRoleDto): Promise<void> {
        await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name);
    }

    private async validateDelete(id: number): Promise<Role> {
        return await this.checkifExist(id);
    }

    private async checkifNotExistByName(name: string): Promise<void> {
        const role = await this.rolesRepository.getByName(name);

        if (role) throw new ConflictException(`Role with name ${name} already exists.`);
    }

    private async checkifExist(id: number): Promise<Role> {
        const role = await this.rolesRepository.getById(id);

        if (!role) throw new NotFoundException();

        return role;
    }

    //#endregion
}

interface IRolesService {
    createRole(dto: CreateRoleDto): Promise<Role>;
    deleteRole(id: number): Promise<void>;
    getRole(id: number): Promise<RoleViewModel>;
    getRoleByName(name: string): Promise<Role>;
    getRoles(queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>>;
}

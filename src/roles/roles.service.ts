import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./entities/role.entity";
import { RolesViewModelFactory } from "./model-factories/roles.vm-factory";
import { RolesRepository } from "./roles.repository";
import { RoleViewModel } from "./view-models";

@Injectable()
export class RolesService implements IRolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
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
        const rolesQuery = this.rolesRepository.getAllQ();

        const usersQConfig = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "role",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "role",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [roles, count] = await ApplyToQueryExtension.applyToQuery<Role>(
            queryParams,
            rolesQuery,
            usersQConfig,
        );

        const model = this.rolesViewModelFactory.initRoleListViewModel(roles);

        return new DataListResponse<RoleViewModel>(model, count);
    }

    //#endregion

    //#region Private methods

    private async validateCreate(dto: CreateRoleDto): Promise<void> {
        await this.checkifExist(dto);
    }

    private async checkifExist(dto: CreateRoleDto): Promise<void> {
        const role = await this.rolesRepository.getByName(dto.name);

        if (role) throw new ConflictException(`Role with name ${dto.name} already exists.`);
    }

    //#endregion
}

interface IRolesService {
    createRole(dto: CreateRoleDto): Promise<Role>;
    getRole(id: number): Promise<RoleViewModel>;
    getRoleByName(name: string): Promise<Role>;
    getRoles(queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>>;
}

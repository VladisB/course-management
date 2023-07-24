import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension } from "@common/query-extention";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { RoleViewModelFactory } from "./model-factories/role.vm-factory";
import { IRolesRepository } from "./roles.repository";
import { RoleViewModel } from "./view-models";
import { BaseErrorMessage } from "@common/enum";
import { RoleModelFactory } from "./model-factories/";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RolesService implements IRolesService {
    constructor(
        private readonly rolesRepository: IRolesRepository,
        private readonly RoleViewModelFactory: RoleViewModelFactory,
    ) {}

    //#region Public methods

    public async createRole(dto: CreateRoleDto, user: User): Promise<RoleViewModel> {
        await this.validateCreate(dto);

        const newEntity = RoleModelFactory.create({
            name: dto.name,
            createdBy: user,
            createdAt: new Date(),
        });

        const role = await this.rolesRepository.create(newEntity);

        return this.RoleViewModelFactory.initRoleViewModel(role);
    }

    public async getRoleByName(name: string): Promise<Role> {
        return await this.rolesRepository.getByName(name);
    }

    public async getRole(id: number): Promise<RoleViewModel> {
        const role = await this.rolesRepository.getById(id);

        if (!role) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.RoleViewModelFactory.initRoleViewModel(role);
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

        const model = this.RoleViewModelFactory.initRoleListViewModel(roles);

        return new DataListResponse<RoleViewModel>(model, count);
    }

    public async updateRole(id: number, dto: UpdateRoleDto, user: User): Promise<RoleViewModel> {
        const role = await this.validateUpdate(id, dto);

        const updatedEntity = RoleModelFactory.update({
            id: role.id,
            name: dto.name,
            modifiedBy: user,
            modifiedAt: new Date(),
        });

        const model = await this.rolesRepository.update(updatedEntity);

        return this.RoleViewModelFactory.initRoleViewModel(model);
    }

    public async deleteRole(id: number): Promise<void> {
        await this.validateDelete(id);

        await this.rolesRepository.deleteById(id);
    }

    //#endregion

    //#region Private methods

    private async validateCreate(dto: CreateRoleDto): Promise<void> {
        await this.checkifNotExistByName(dto.name);
    }

    private async validateUpdate(id: number, dto: UpdateRoleDto): Promise<Role> {
        const role = await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name);

        return role;
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

        if (!role) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return role;
    }

    //#endregion
}

interface IRolesService {
    createRole(dto: CreateRoleDto, user: User): Promise<RoleViewModel>;
    updateRole(id: number, updateRoleDto: UpdateRoleDto, user: User): Promise<RoleViewModel>;
    deleteRole(id: number): Promise<void>;
    getRole(id: number): Promise<RoleViewModel>;
    getRoleByName(name: string): Promise<Role>;
    getRoles(queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>>;
}

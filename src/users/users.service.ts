import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RoleName } from "../roles/roles.enum";
import { Role } from "../roles/entities/role.entity";
import { UsersRepository } from "./users.repository";
import { UsersViewModelFactory } from "./model-factories";
import { UserViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "../common/dto/query-params.dto";
import { ApplyToQueryExtension } from "../common/query-extention";
import { RolesRepository } from "src/roles/roles.repository";

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        private rolesRepository: RolesRepository,
        private usersRepository: UsersRepository,
        private usersViewModelFactory: UsersViewModelFactory,
    ) {}

    //#region Public methods

    public async createUser(dto: CreateUserDto): Promise<User> {
        let role = await this.validateCreate(dto);

        if (!role) role = await this.rolesRepository.getByName(RoleName.Student);

        return await this.usersRepository.create(dto, role);
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserViewModel> {
        const role = await this.validateUpdate(id, updateUserDto);

        const model = await this.usersRepository.update(id, updateUserDto, role);

        return this.usersViewModelFactory.initUserViewModel(model);
    }

    public async getAllUsers(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<UserViewModel>> {
        const usersQuery = this.usersRepository.getAllQ();

        const usersQConfig = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "firstName",
                    prop: "first_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "lastName",
                    prop: "last_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [users, count] = await ApplyToQueryExtension.applyToQuery<User>(
            queryParams,
            usersQuery,
            usersQConfig,
        );

        const model = this.usersViewModelFactory.initUserListViewModel(users);

        return new DataListResponse<UserViewModel>(model, count);
    }

    public async getUser(id: number): Promise<UserViewModel> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException("User not found");

        return this.usersViewModelFactory.initUserViewModel(user);
    }

    public async deleteUser(id: number): Promise<void> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException("User not found");

        await user.remove();
    }

    //#endregion

    //#region Private methods

    private async validateCreate(updateUserDto: UpdateUserDto): Promise<Role> {
        await this.checkIfUserExistByEmail(updateUserDto.email);

        return await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async validateUpdate(id: number, updateUserDto: UpdateUserDto): Promise<Role> {
        await this.checkIfUserExistById(id);
        await this.checkIfUserExistByEmail(updateUserDto.email, id);

        return await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async checkIfUserExistById(id: number): Promise<void> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException();
    }

    private async checkIfUserExistByEmail(email: string, id?: number): Promise<void> {
        if (!email) return;

        const user = await this.usersRepository.getByEmail(email);

        if (id && user && user.id === id) return;

        if (user) throw new ConflictException("Email is already taken");
    }

    private async checkIfRoleExist(roleId: number): Promise<Role> {
        if (!roleId) return;

        const role = await this.rolesRepository.getById(roleId);

        if (!role) throw new NotFoundException("Role not found");

        return role;
    }

    //#endregion
}

interface IUsersService {
    createUser(dto: CreateUserDto): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getAllUsers(queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>>;
    getUser(id: number): Promise<UserViewModel>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserViewModel>;
}

import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesService } from "../roles/roles.service";
import { RoleName } from "../roles/roles.enum";
import { Role } from "../roles/entities/role.entity";
import { UsersRepository } from "./users.repository";
import { UsersViewModelFactory } from "./model-factories";
import { UserViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "../common/dto/query-params.dto";
import { ApplyToQueryExtension } from "../common/query-extention";

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        private roleService: RolesService,
        private usersRepository: UsersRepository,
        private usersViewModelFactory: UsersViewModelFactory,
    ) {}

    //#region Public methods

    public async createUser(dto: CreateUserDto): Promise<User> {
        let role = await this.validateCreate(dto);

        if (!role) role = await this.roleService.getRoleByName(RoleName.Student);

        return await this.usersRepository.create(dto, role);
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const role = await this.validateUpdate(id, updateUserDto);

        return await this.usersRepository.update(id, updateUserDto, role);
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

    //#endregion

    //#region Private methods

    private async validateCreate(updateUserDto: UpdateUserDto): Promise<Role> {
        await this.checkIfUserExistByEmail(updateUserDto.email);

        return await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async validateUpdate(id: number, updateUserDto: UpdateUserDto): Promise<Role> {
        await this.checkIfUserExistById(id);
        await this.checkIfUserExistByEmail(updateUserDto.email);

        return await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async checkIfUserExistById(id: number): Promise<void> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException("User already exists");
    }

    private async checkIfUserExistByEmail(email: string): Promise<void> {
        if (!email) return;

        const user = await this.usersRepository.getByEmail(email);

        if (user) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }

    private async checkIfRoleExist(roleId: number): Promise<Role> {
        if (!roleId) return;

        const role = await this.roleService.getRoleById(roleId);

        if (!role) throw new NotFoundException("Role not found");

        return role;
    }

    //#endregion
}

interface IUsersService {
    createUser(dto: CreateUserDto): Promise<User>;
    getAllUsers(queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>>;
    getUser(id: number): Promise<UserViewModel>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
}

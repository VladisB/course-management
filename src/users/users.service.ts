import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RoleName } from "../roles/roles.enum";
import { UsersRepository } from "./users.repository";
import { UsersViewModelFactory } from "./model-factories";
import { UserViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "../common/dto/query-params.dto";
import { ApplyToQueryExtension } from "../common/query-extention";
import { RolesRepository } from "src/roles/roles.repository";
import { IGroupsRepository } from "src/groups/groups.repository";
import { Group } from "src/groups/entities/group.entity";

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        private rolesRepository: RolesRepository,
        private usersRepository: UsersRepository,
        private groupsRepository: IGroupsRepository,
        private usersViewModelFactory: UsersViewModelFactory,
    ) {}

    //#region Public methods

    public async createUser(dto: CreateUserDto): Promise<User> {
        await this.validateCreate(dto);

        const roleId = dto.roleId
            ? dto.roleId
            : (await this.rolesRepository.getByName(RoleName.Student)).id;

        return await this.usersRepository.create(dto, roleId);
    }

    public async updateUser(id: number, dto: UpdateUserDto): Promise<UserViewModel> {
        await this.validateUpdate(id, dto);

        const transaction = await this.usersRepository.initTrx();

        try {
            const model = await this.usersRepository.trxUpdate(transaction, id, dto, dto.roleId);
            // TODO: Create student courses records

            await this.usersRepository.commitTrx(transaction);

            return this.usersViewModelFactory.initUserViewModel(model);
        } catch (err) {
            console.error(err);

            await this.usersRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async getAllUsers(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<UserViewModel>> {
        const query = this.usersRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "firstName",
                    prop: "first_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "lastName",
                    prop: "last_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };

        const [users, count] = await ApplyToQueryExtension.applyToQuery<User>(
            queryParams,
            query,
            config,
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
        const user = await this.validateDelete(id);

        await this.usersRepository.deleteById(user.id);
    }

    //#endregion

    //#region Private methods

    private async validateCreate(updateUserDto: UpdateUserDto): Promise<void> {
        await this.checkIfUserExistByEmail(updateUserDto.email);
        await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async validateUpdate(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        await this.checkIfUserExistById(id);
        await this.checkIfUserExistByEmail(updateUserDto.email, id);
        await this.checkIfGroupNotExist(updateUserDto.groupId);
        await this.checkIfRoleExist(updateUserDto.roleId);
    }

    private async validateDelete(id: number): Promise<User> {
        return await this.checkIfUserExistById(id);
    }

    private async checkIfUserExistById(id: number): Promise<User> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException();

        return user;
    }

    private async checkIfGroupNotExist(id: number): Promise<Group> {
        if (!id) return;

        const group = await this.groupsRepository.getById(id);

        if (!group) throw new NotFoundException("Group not found");

        return group;
    }

    private async checkIfUserExistByEmail(email: string, id?: number): Promise<void> {
        if (!email) return;

        const user = await this.usersRepository.getByEmail(email);

        if (id && user && user.id === id) return;

        if (user) throw new ConflictException("Email is already taken");
    }

    private async checkIfRoleExist(roleId: number): Promise<void> {
        if (!roleId) return;

        const role = await this.rolesRepository.getById(roleId);

        if (!role) throw new NotFoundException("Role not found");
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

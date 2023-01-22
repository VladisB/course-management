import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesService } from "../roles/roles.service";
import { RoleName } from "../roles/roles.enum";
import { Role } from "../roles/role.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private roleService: RolesService, private usersRepository: UsersRepository) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        let role = await this.validateCreate(dto);

        if (!role) role = await this.roleService.getRoleByName(RoleName.Student);

        return await this.usersRepository.create(dto, role);
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const role = await this.validateUpdate(id, updateUserDto);

        return await this.usersRepository.update(id, updateUserDto, role);
    }

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

    async getAllUsers() {
        // TODO: add pagination, sorting, filtering
        return await this.usersRepository.getAll();
    }

    async getUserByEmail(email: string) {
        return await this.usersRepository.getByEmail(email);
    }

    async getUserById(id: number): Promise<User> {
        return await this.usersRepository.getById(id);
    }
}

import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesService } from "../roles/roles.service";
import { RoleName } from "../roles/roles.enum";
import { Role } from "../roles/role.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private roleService: RolesService,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        let role = await this.validateCreate(dto);

        if (!role) role = await this.roleService.getRoleByName(RoleName.Student);
        const user = await this.userRepository.create({
            ...dto,
            role,
        });

        return user.save();
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const role = await this.validateUpdate(id, updateUserDto);

        const user = await this.userRepository.preload({
            id,
            ...updateUserDto,
            role,
        });

        return user.save();
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
        const user = await this.userRepository.findBy({ id });

        if (!user) throw new NotFoundException("User already exists");
    }

    private async checkIfUserExistByEmail(email: string): Promise<void> {
        if (!email) return;

        const user = await this.userRepository.findOneBy({ email });

        if (user) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }

    private async checkIfRoleExist(roleId: number): Promise<Role> {
        if (!roleId) return;

        const role = await this.roleService.getRoleById(roleId);

        if (!role) throw new NotFoundException("Role not found");

        return role;
    }

    async getAllUsers() {
        const users = await this.userRepository.find();
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOneBy({ email });
        return user;
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }
}

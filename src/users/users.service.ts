import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "src/roles/roles.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/roles.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // TODO: Add validation for email field
    // TODO: Handle duplicates
    // TODO: Handle if role not exist
    const role = await this.roleService.getRoleByName(Role.Student);

    const user = await this.userRepository.create({
      ...dto,
      role,
    });

    return user.save();
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}

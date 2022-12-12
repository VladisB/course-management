import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // private readonly userService: UsersService,
  ) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(dto);
    return role.save();
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    return role;
  }

  async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    return role;
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}

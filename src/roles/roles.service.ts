import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InjectRepository } from "@nestjs/typeorm";
// import { UsersService } from 'src/users/users.service';
import { Repository } from "typeorm";
import { AssignRoleDto } from "./dto/assign-role.dto";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // @Inject(forwardRef(() => UsersService)) // private readonly userService: UsersService,
  ) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.create(dto);
    return role.save();
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    return role;
  }

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  // async assignRole(dto: AssignRoleDto) {
  //   const { role: value, email } = dto;
  //   console.log(`DTO`, value);
  //   const user = await this.userService.getUserByEmail(email);
  //   if (!user) {
  //     throw new HttpException(
  //       'The user with this email address does not exist',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const role = await this.roleRepository.findOne({ where: { value } });
  //   if (!role) {
  //     throw new HttpException(
  //       'The role does not exist',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   await user.$set('roles', [role.id]);
  //   return true;
  // }
}

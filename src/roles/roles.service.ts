import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from 'src/users/users.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async assignRole(dto: AssignRoleDto) {
    const { role: value, email } = dto;
    console.log(`DTO`, value);
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'The user with this email address does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = await this.roleRepository.findOne({ where: { value } });
    if (!role) {
      throw new HttpException(
        'The role does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    await user.$set('roles', [role.id]);
    return true;
  }
}

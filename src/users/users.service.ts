import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    // @InjectModel(User) private userRepository: typeof User,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // TODO: Add transaction
    // TODO: Add validation for email field
    
    const user = await this.userRepository.create({
      ...dto
    });
    // const role = await this.roleService.getRoleByValue('STUDENT');
    // await user.$set('roles', [role.id]);
    // user.roles = [role];
    return user;
  }

  // async getAllUsers() {
  //   const users = await this.userRepository.findAll({ include: { all: true } });
  //   return users;
  // }

  // async getUserByEmail(email: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { email },
  //     include: { all: true },
  //   });
  //   return user;
  // }
}

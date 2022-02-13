import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    
    const user = await this.validateUser(userDto);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshTokenHash(user, tokens.refresh_token)
   
    return tokens
  }

  async signUp(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateTokens(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Wrong data to login!' });
  }

  async updateRefreshTokenHash(user: User, rt: string): Promise<void> {
    const hashToken = await bcrypt.hash(rt, 5);
    await User.update({ refreshToken: hashToken}, { where: { email: user.email } })
  }
  
  async generateTokens(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      email: user.email,
      id: user.id,
      roles: user.roles
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET || 'SECRET',
        expiresIn: '60m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET || 'SECRET_RT',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

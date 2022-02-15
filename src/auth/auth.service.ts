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

  private async updateRefreshTokenHash(user: User, rt: string): Promise<void> {
    const hashToken = await bcrypt.hash(rt, 5);
    await User.update({ refreshToken: hashToken}, { where: { email: user.email } })
  }
 
  private async removeTokenHash(user: User, rt: string): Promise<void> {
    await User.update({ refreshToken: null}, { where: { email: user.email } })
  }
  
  private async findRefreshTokenHashDB(payload: JwtPayload, refreshToken: string): Promise<User> {
    const candidate = await User.findOne({ where: { email: payload?.email } })
  
    if (candidate) {
      const hashEquals = await bcrypt.compare(
        refreshToken,
        candidate.refreshToken,
      );

      return hashEquals ? candidate : null;
    } else {
      return null;
    }
  }
  
  private async generateTokens(user: User): Promise<Tokens> {
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

  private async validateRefreshToken(refreshToken: string) {
    try {
      const userData = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.RT_SECRET || 'SECRET_RT'});
     
      return userData;
    } catch {
      return null;
    }
  }

  public async refresh(refreshToken: string) {
    try {
      if(!refreshToken){
        throw new UnauthorizedException({ message: 'Unauthorized user!' });
      }
      const userData = await this.validateRefreshToken(refreshToken);
      const user = await this.findRefreshTokenHashDB(userData, refreshToken)
  
      if (!userData || !user) {
        throw new UnauthorizedException({ message: 'Unauthorized user!' });
      }
      
      const tokens = await this.generateTokens(user);
      await this.updateRefreshTokenHash(user, tokens.refresh_token);
  
      return tokens;
    } catch {
      throw new UnauthorizedException({ message: 'Unauthorized user!' });
    }
  }
  
  public async logout(refreshToken: string) {
    try {
      if(!refreshToken){
        throw new UnauthorizedException({ message: 'Unauthorized user!' });
      }

      const userData = await this.validateRefreshToken(refreshToken);
      const user = await this.findRefreshTokenHashDB(userData, refreshToken)
  
      if (!user) {
        throw new UnauthorizedException({ message: 'Unauthorized user!' });
      }
      
      const tokens = await this.generateTokens(user);
      await this.removeTokenHash(user, tokens.refresh_token);
  
      //@TODO: refactor responce
      return true;
    } catch {
      throw new UnauthorizedException({ message: 'Unauthorized user!' });
    }
  }
}

import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Res({ passthrough: true }) res: Response, @Body() userDto: CreateUserDto) {

    const tokens = await this.authService.login(userDto);
    res.cookie('refReshToken', tokens.refresh_token, { httpOnly: true })

    return tokens;
  }

  @Post('/signup')
  @HttpCode(201)
  async registration(@Res({ passthrough: true }) res: Response, @Body() userDto: CreateUserDto) {
    
    const tokens = await this.authService.signUp(userDto);
    res.cookie('refReshToken', tokens.refresh_token, { httpOnly: true })

    return this.authService.login(userDto);
  }
}

import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('/login')
  // @HttpCode(200)
  // async login(
  //   @Res({ passthrough: true }) res: Response,
  //   @Body() userDto: CreateUserDto,
  // ) {
  //   const tokens = await this.authService.login(userDto);
  //   res.cookie('refreshToken', tokens.refresh_token, { httpOnly: true });

  //   return tokens;
  // }

  @Post('/signup')
  @HttpCode(201)
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: CreateUserDto,
  ) {
    const tokens = await this.authService.signUp(userDto);
    res.cookie('refreshToken', tokens.refresh_token, { httpOnly: true });

    return tokens;
  }

  // @Post('/refresh')
  // @HttpCode(201)
  // async updateRefresh(
  //   @Res({ passthrough: true }) res: Response,
  //   @Req() req: Request,
  //   @Body() userDto: CreateUserDto,
  // ) {
  //   const { refreshToken } = req?.cookies;
  //   const tokens = await this.authService.refresh(refreshToken);

  //   return tokens;
  // }

  // @Post('/logout')
  // @HttpCode(200)
  // async logout(@Req() req: Request) {
  //   const { refreshToken } = req?.cookies;
  //   const tokens = await this.authService.logout(refreshToken);

  //   return tokens;
  // }
}

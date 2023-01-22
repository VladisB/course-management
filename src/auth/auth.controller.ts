import {
    Body,
    Controller,
    HttpCode,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto";
import { GetUser } from "./get-user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @HttpCode(200)
    async login(@Res({ passthrough: true }) res: Response, @Body() authDto: AuthCredentialsDto) {
        const tokens = await this.authService.login(authDto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async registration(@Res({ passthrough: true }) res: Response, @Body() userDto: CreateUserDto) {
        const tokens = await this.authService.signUp(userDto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/refresh")
    @UseGuards(AuthGuard("refresh"))
    @HttpCode(201)
    async updateRefresh(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.refreshToken(user);

        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/logout")
    @UseGuards(AuthGuard("jwt"))
    @HttpCode(200)
    async logout(@GetUser() user: User) {
        await this.authService.logout(user);
    }
}

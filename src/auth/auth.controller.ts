import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto";
import { GetUser } from "./get-user.decorator";
import { AuthViewModel } from "./models";
import { Strategies } from "./strategies.enum";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { User } from "@app/users/entities/user.entity";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @HttpCode(200)
    async login(
        @Res({ passthrough: true }) res: Response,
        @Body() authDto: AuthCredentialsDto,
    ): Promise<AuthViewModel> {
        const tokens = await this.authService.login(authDto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async registration(
        @Res({ passthrough: true }) res: Response,
        @Body() userDto: CreateUserDto,
    ): Promise<AuthViewModel> {
        const tokens = await this.authService.signUp(userDto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/refresh")
    @UseGuards(AuthGuard("refresh"))
    @HttpCode(201)
    async updateRefresh(
        @GetUser() user: User,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthViewModel> {
        const tokens = await this.authService.refreshToken(user);

        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/logout")
    @UseGuards(AuthGuard(Strategies.JWT))
    @HttpCode(200)
    async logout(@GetUser() user: User): Promise<void> {
        await this.authService.logout(user);
    }

    @Get("/version")
    @HttpCode(200)
    async version(): Promise<string> {
        return "Current version 0.0.3";
    }
}

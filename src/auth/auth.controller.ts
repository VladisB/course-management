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
import { AuthSignUpDto } from "./dto";
import { GetUser } from "./get-user.decorator";
import { AuthViewModel } from "./models";
import { Strategies } from "./strategies.enum";
import { User } from "@app/users/entities/user.entity";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(200)
    async login(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: AuthLoginDto,
    ): Promise<AuthViewModel> {
        const tokens = await this.authService.login(dto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async signUp(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: AuthSignUpDto,
    ): Promise<AuthViewModel> {
        const tokens = await this.authService.signUp(dto);
        res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

        return tokens;
    }

    @Post("/refresh")
    @UseGuards(AuthGuard(Strategies.JWT_REFRESH))
    @HttpCode(200)
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
    @HttpCode(204)
    async logout(@GetUser() user: User): Promise<void> {
        await this.authService.logout(user);
    }

    // NOTE: for testing purposes
    @Get("/version")
    @HttpCode(200)
    async version(): Promise<string> {
        return "Current version 1.0.1";
    }
}

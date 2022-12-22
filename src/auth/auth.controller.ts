import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { GetUser } from "./get-user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @HttpCode(200)
    async login(@Res({ passthrough: true }) res: Response, @Body() userDto: CreateUserDto) {
        const tokens = await this.authService.login(userDto);
        res.cookie("refreshToken", tokens.refresh_token, { httpOnly: true });

        return tokens;
    }

    @Post("/signup")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(201)
    async registration(
        @Res({ passthrough: true }) res: Response,
        @Body() authCredentialsDto: CreateUserDto,
    ) {
        const tokens = await this.authService.signUp(authCredentialsDto);
        res.cookie("refreshToken", tokens.refresh_token, { httpOnly: true });

        return tokens;
    }

    @Post("/refresh")
    @HttpCode(201)
    async updateRefresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        const { refreshToken } = req.cookies;
        const tokens = await this.authService.refresh(refreshToken);

        return tokens;
    }

    @Post("/logout")
    @UseGuards(AuthGuard("jwt"))
    @HttpCode(200)
    async logout(@GetUser() user: User) {
        await this.authService.logout(user);
    }
}

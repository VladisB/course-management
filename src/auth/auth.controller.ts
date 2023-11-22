import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseInternalServerError,
} from "@app/common/swagger/common-api-responses-swagger";

@ApiTags("Auth")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    @UsePipes(new ValidationPipe({ transform: true }))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login" })
    @ApiBody({ type: AuthLoginDto })
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: AuthViewModel, description: "Login successful" })
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
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Sign up" })
    @ApiBody({ type: AuthSignUpDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: AuthViewModel,
        description: "Sign up successful",
    })
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
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthViewModel,
        description: "Refresh access token successful",
    })
    @ApiBearerAuth()
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
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Logout successful",
    })
    @ApiBearerAuth()
    async logout(@GetUser() user: User): Promise<void> {
        await this.authService.logout(user);
    }

    // NOTE: for testing purposes
    @Get("/version")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Current version of API. JUST FOR TESTING" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Version",
        type: String,
    })
    async version(): Promise<string> {
        return "Current version 1.0.1";
    }
}

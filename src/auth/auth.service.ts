import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/user.entity";
import { JwtPayload, Tokens } from "./types";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateLogin(userDto);
        const tokens = await this.generateTokens(user);
        await this.updateRefreshTokenHash(user.email, tokens.refresh_token);

        return tokens;
    }

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        this.validateCreate(authCredentialsDto);

        const user = await this.userService.createUser({
            ...authCredentialsDto,
        });

        return this.generateTokens(user);
    }

    private async validateCreate(authCredentialsDto: AuthCredentialsDto) {
        await this.checkIfExist(authCredentialsDto);
    }

    private async checkIfExist(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const user = await this.userService.getUserByEmail(authCredentialsDto.email);

        if (user) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }

    private async validateLogin(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const user = await this.checkIsExist(authCredentialsDto);
        await this.checkIsPasswordEquals(authCredentialsDto, user);

        return user;
    }

    private async checkIsExist(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const user = await this.userService.getUserByEmail(authCredentialsDto.email);

        if (!user) {
            throw new UnauthorizedException({ message: "Wrong credentials!" });
        }

        return user;
    }

    private async checkIsPasswordEquals(
        authCredentialsDto: AuthCredentialsDto,
        user: User,
    ): Promise<void> {
        const { password } = authCredentialsDto;
        const equals = await bcrypt.compare(password, user.password);

        if (!equals) throw new UnauthorizedException({ message: "Wrong credentials!" });
    }

    public async validateJwtUser(payload: JwtPayload): Promise<User> {
        const user = await this.userService.getUserByEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException({ message: "Invalid token" });
        }

        return user;
    }

    private async updateRefreshTokenHash(userEmail: string, refreshToken: string): Promise<void> {
        const hashToken = await bcrypt.hash(refreshToken, 5);

        const user = await this.userService.getUserByEmail(userEmail);
        user.refreshToken = hashToken;

        await user.save();
    }

    private async removeTokenHash(userEmail: string, refreshToken: string): Promise<void> {
        const user = await this.userService.getUserByEmail(userEmail);
        user.refreshToken = null;

        await user.save();
    }

    private async findRefreshTokenHashDB(payload: JwtPayload, refreshToken: string): Promise<User> {
        const candidate = await User.findOne({ where: { email: payload?.email } });

        if (candidate) {
            const hashEquals = await bcrypt.compare(refreshToken, candidate.refreshToken);

            return hashEquals ? candidate : null;
        } else {
            return null;
        }
    }

    private async generateTokens(user: User): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            email: user.email,
            id: user.id,
            role: user.role.name,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                // secret: process.env.AT_SECRET || "someSecret22",
                secret: "someSecret22",
                expiresIn: "15m",
            }),
            this.jwtService.signAsync(jwtPayload, {
                // secret: process.env.RT_SECRET || "someSecret22",
                secret: "someSecret22",
                expiresIn: "3d",
            }),
        ]);

        return {
            access_token,
            refresh_token,
        };
    }

    private async validateRefreshToken(refreshToken: string) {
        try {
            const userData = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.RT_SECRET || "SECRET_RT",
            });

            return userData;
        } catch {
            return null;
        }
    }

    public async refresh(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new UnauthorizedException({ message: "Unauthorized user!" });
            }
            const userData = await this.validateRefreshToken(refreshToken);
            const user = await this.findRefreshTokenHashDB(userData, refreshToken);

            if (!userData || !user) {
                throw new UnauthorizedException({ message: "Unauthorized user!" });
            }

            const tokens = await this.generateTokens(user);
            await this.updateRefreshTokenHash(user.email, tokens.refresh_token);

            return tokens;
        } catch {
            throw new UnauthorizedException({ message: "Unauthorized user!" });
        }
    }

    public async logout(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new UnauthorizedException({ message: "Unauthorized user!" });
            }

            const userData = await this.validateRefreshToken(refreshToken);
            const user = await this.findRefreshTokenHashDB(userData, refreshToken);

            if (!user) {
                throw new UnauthorizedException({ message: "Unauthorized user!" });
            }

            const tokens = await this.generateTokens(user);
            await this.removeTokenHash(user.email, tokens.refresh_token);

            //@TODO: refactor responce
            return true;
        } catch {
            throw new UnauthorizedException({ message: "Unauthorized user!" });
        }
    }
}

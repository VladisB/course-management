import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtModelFactory } from "./model-factories/jwt.m-factory";
import { UserViewModelFactory } from "../users/model-factories/user.vm-factory";
import { UserViewModel } from "../users/view-models";
import { AuthViewModel, JwtModel } from "./models";
import { User } from "../users/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private jwtModelFactory: JwtModelFactory,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private userService: UsersService,
        private userViewModelFactory: UserViewModelFactory,
    ) {}

    public async login(userDto: AuthCredentialsDto): Promise<AuthViewModel> {
        const user = await this.validateLogin(userDto);

        const jwtModel = this.jwtModelFactory.initJwtModel(user);
        const tokens = await this.generateTokens(jwtModel);

        await this.updateRefreshToken(user.email, tokens.refreshToken);

        return tokens;
    }

    public async signUp(authCredentialsDto: CreateUserDto): Promise<AuthViewModel> {
        this.validateCreate(authCredentialsDto);

        const user = await this.userService.createUser({
            ...authCredentialsDto,
        });
        const jwtModel = this.jwtModelFactory.initJwtModel(user);

        return this.generateTokens(jwtModel);
    }

    public async validateJwt(payload: JwtModel): Promise<UserViewModel> {
        const user = await this.userService.getUserByEmail(payload.email);

        if (!user) throw new UnauthorizedException({ message: "Invalid token" });

        return this.userViewModelFactory.initUserViewModel(user);
    }

    public async validateRefreshJwt(
        payload: JwtModel,
        refreshToken: string,
    ): Promise<UserViewModel> {
        const user = await this.userService.getUserByEmail(payload.email);

        if (!user) throw new UnauthorizedException({ message: "Invalid token" });

        const result = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!result) throw new UnauthorizedException({ message: "Invalid token" });

        return this.userViewModelFactory.initUserViewModel(user);
    }

    private async validateCreate(authCredentialsDto: AuthCredentialsDto): Promise<void> {
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
        const equals = await user.validatePassword(password);

        if (!equals) throw new UnauthorizedException({ message: "Wrong credentials!" });
    }

    private async updateRefreshToken(userEmail: string, refreshToken: string): Promise<void> {
        const hashToken = await bcrypt.hash(refreshToken, 5);

        const user = await this.userService.getUserByEmail(userEmail);
        user.refreshToken = hashToken;

        await user.save();
    }

    private async removeTokenHash(userEmail: string): Promise<void> {
        const user = await this.userService.getUserByEmail(userEmail);
        user.refreshToken = null;

        await user.save();
    }

    public async generateTokens(payload: JwtModel): Promise<AuthViewModel> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("app.jwt"),
                expiresIn: "15m",
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("app.jwt"),
                expiresIn: "1d",
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    public async refresh(user: User) {
        const jwtModel = this.jwtModelFactory.initJwtModel(user);

        const tokens = await this.generateTokens(jwtModel);
        await this.updateRefreshToken(user.email, tokens.refreshToken);

        return tokens;
    }

    public async logout(tokenUser: User): Promise<void> {
        try {
            const user = await this.userService.getUserById(tokenUser.id);

            if (!user) {
                throw new NotFoundException();
            }

            await this.removeTokenHash(user.email);
        } catch {
            throw new UnauthorizedException({ message: "Unauthorized user!" });
        }
    }
}

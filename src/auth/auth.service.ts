import {
    ConflictException,
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
import { UsersViewModelFactory } from "../users/model-factories/user.vm-factory";
import { UserViewModel } from "../users/view-models";
import { AuthViewModel, JwtModel } from "./models";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private jwtModelFactory: JwtModelFactory,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private usersRepository: UsersRepository,
        private userService: UsersService,
        private usersViewModelFactory: UsersViewModelFactory,
    ) {}

    //#region Public methods

    public async login(dto: AuthCredentialsDto): Promise<AuthViewModel> {
        const user = await this.validateLogin(dto);

        const jwtModel = this.jwtModelFactory.initJwtModel(user);
        const tokens = await this.generateTokens(jwtModel);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    public async signUp(dto: CreateUserDto): Promise<AuthViewModel> {
        await this.validateCreate(dto);

        const user = await this.userService.createUser(dto);
        const jwtModel = this.jwtModelFactory.initJwtModel(user);

        return this.generateTokens(jwtModel);
    }

    public async validateJwt(payload: JwtModel): Promise<UserViewModel> {
        const user = await this.usersRepository.getByEmail(payload.email);

        if (!user) throw new UnauthorizedException({ message: "Invalid token" });

        return this.usersViewModelFactory.initUserViewModel(user);
    }

    public async validateRefreshToken(
        payload: JwtModel,
        refreshToken: string,
    ): Promise<UserViewModel> {
        const user = await this.usersRepository.getByEmail(payload.email);

        if (!user || !user.refreshToken)
            throw new UnauthorizedException({ message: "Invalid token" });

        const result = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!result) throw new UnauthorizedException({ message: "Invalid token" });

        return this.usersViewModelFactory.initUserViewModel(user);
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

    public async refreshToken(user: User): Promise<AuthViewModel> {
        const jwtModel = this.jwtModelFactory.initJwtModel(user);

        const tokens = await this.generateTokens(jwtModel);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    public async logout(tokenUser: User): Promise<void> {
        try {
            const user = await this.usersRepository.getById(tokenUser.id);

            if (!user) {
                throw new NotFoundException();
            }

            await this.removeTokenHash(user.email);
        } catch {
            throw new UnauthorizedException({ message: "Unauthorized user!" });
        }
    }

    //#endregion

    //#region Private methods

    private async validateLogin(dto: AuthCredentialsDto): Promise<User> {
        const user = await this.checkIsExist(dto);
        await this.checkIsPasswordEquals(dto, user);

        return user;
    }

    private async validateCreate(dto: AuthCredentialsDto): Promise<void> {
        await this.checkIfExist(dto);
    }

    private async checkIfExist(dto: AuthCredentialsDto): Promise<void> {
        const user = await this.usersRepository.getByEmail(dto.email);

        if (user) throw new ConflictException("User already exists");
    }

    private async checkIsExist(dto: AuthCredentialsDto): Promise<User> {
        const user = await this.usersRepository.getByEmail(dto.email);

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

    private async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
        const hashToken = await bcrypt.hash(refreshToken, 5);

        await this.usersRepository.updateRefreshToken(id, hashToken);
    }

    private async removeTokenHash(userEmail: string): Promise<void> {
        const user = await this.usersRepository.getByEmail(userEmail);

        await this.usersRepository.updateRefreshToken(user.id, null);
    }

    //#endregion
}

interface IAuthService {
    generateTokens(payload: JwtModel): Promise<AuthViewModel>;
    login(dto: AuthCredentialsDto): Promise<AuthViewModel>;
    logout(tokenUser: User): Promise<void>;
    refreshToken(user: User): Promise<AuthViewModel>;
    signUp(dto: CreateUserDto): Promise<AuthViewModel>;
    validateJwt(payload: JwtModel): Promise<UserViewModel>;
    validateRefreshToken(payload: JwtModel, refreshToken: string): Promise<UserViewModel>;
}

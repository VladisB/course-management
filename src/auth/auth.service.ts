import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { AuthSignUpDto } from "./dto/auth-signup.dto";
import { JwtModelFactory } from "./model-factories/jwt.m-factory";
import { AuthViewModel, JwtModel } from "./models";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { IUsersRepository } from "@app/users/users.repository";
import { IUsersManagementService } from "@app/users-management/users-management.service";
import { BaseErrorMessage } from "@app/common/enum";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private jwtModelFactory: JwtModelFactory,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private usersManagementService: IUsersManagementService,
        private usersRepository: IUsersRepository,
    ) {}

    //#region Public methods

    public async login(dto: AuthLoginDto): Promise<AuthViewModel> {
        const user = await this.validateLogin(dto);

        const jwtModel = this.jwtModelFactory.initJwtModel(user);
        const tokens = await this.generateTokens(jwtModel);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    public async signUp(dto: AuthSignUpDto): Promise<AuthViewModel> {
        await this.validateCreate(dto);

        const user = await this.usersManagementService.signUpStudent(dto);
        const jwtModel = this.jwtModelFactory.initJwtModel(user);

        const tokens = await this.generateTokens(jwtModel);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    public async validateJwt(payload: JwtModel): Promise<User> {
        const user = await this.usersRepository.getByEmail(payload.email);

        if (!user) throw new UnauthorizedException({ message: "Invalid token" });

        return user;
    }

    public async validateRefreshToken(payload: JwtModel, refreshToken: string): Promise<User> {
        const user = await this.usersRepository.getByEmail(payload.email);

        if (!user || !user.refreshToken)
            throw new UnauthorizedException({ message: "Invalid token" });

        const result = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!result) throw new UnauthorizedException({ message: "Invalid token" });

        return user;
    }

    public async generateTokens(payload: JwtModel): Promise<AuthViewModel> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("app.jwt"),
                expiresIn: this.configService.get<string>("app.accessTokenExpiresIn"),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("app.jwt"),
                expiresIn: this.configService.get<string>("app.refreshTokenExpiresIn"),
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
                throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
            }

            await this.removeTokenHash(user.email);
        } catch (err) {
            console.error(err);

            throw err;
        }
    }

    //#endregion

    //#region Private methods

    private async validateLogin(dto: AuthLoginDto): Promise<User> {
        const user = await this.checkIsExist(dto.email);
        await this.checkIsPasswordEquals(dto.password, user);

        return user;
    }

    private async validateCreate(dto: AuthSignUpDto): Promise<void> {
        await this.checkIfExist(dto.email);
    }

    private async checkIfExist(email: string): Promise<void> {
        const user = await this.usersRepository.getByEmail(email);

        if (user) throw new ConflictException("User already exists");
    }

    private async checkIsExist(email: string): Promise<User> {
        const user = await this.usersRepository.getByEmail(email);

        if (!user) {
            throw new UnauthorizedException({ message: "Wrong credentials!" });
        }

        return user;
    }

    private async checkIsPasswordEquals(password: string, user: User): Promise<void> {
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
    login(dto: AuthSignUpDto): Promise<AuthViewModel>;
    logout(tokenUser: User): Promise<void>;
    refreshToken(user: User): Promise<AuthViewModel>;
    signUp(dto: CreateUserDto): Promise<AuthViewModel>;
    validateJwt(payload: JwtModel): Promise<User>;
    validateRefreshToken(payload: JwtModel, refreshToken: string): Promise<User>;
}

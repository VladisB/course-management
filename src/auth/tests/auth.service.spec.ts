import { Test, TestingModule } from "@nestjs/testing";
import { IUsersRepository } from "@app/users/users.repository";
import { NotFoundException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { studentRoleStub, studentUserStub } from "@app/common/test/stubs";
import { BaseErrorMessage } from "@app/common/enum";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtModelFactory } from "../model-factories";
import { IUsersManagementService } from "@app/users-management/users-management.service";
import { AuthSignUpDto } from "../dto";
import { JwtModel } from "../models";
import * as bcrypt from "bcryptjs";
import { AuthLoginDto } from "../dto/auth-login.dto";

jest.mock("bcryptjs");

describe("AuthService", () => {
    let authService: AuthService;
    let configService: ConfigService;
    let jwtService: JwtService;
    let jwtModelFactory: JwtModelFactory;
    let usersManagementService: IUsersManagementService;
    let usersRepository: IUsersRepository;
    let bcryptCompareMock: jest.Mock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: IUsersManagementService,
                    useValue: {
                        createUser: jest.fn(),
                        signUpStudent: jest.fn(),
                        deleteUser: jest.fn(),
                        getAllUsers: jest.fn(),
                        updateUser: jest.fn(),
                        getUser: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: JwtModelFactory,
                    useValue: {
                        initJwtModel: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        configService = module.get<ConfigService>(ConfigService);
        jwtService = module.get<JwtService>(JwtService);
        jwtModelFactory = module.get<JwtModelFactory>(JwtModelFactory);
        usersManagementService = module.get<IUsersManagementService>(IUsersManagementService);
        usersRepository = module.get<IUsersRepository>(IUsersRepository);
        bcryptCompareMock = jest.fn();
        bcrypt.compare = bcryptCompareMock;
    });

    it("should be defined usersManagementService", () => {
        expect(usersManagementService).toBeDefined();
    });

    it("should be defined usersRepository", () => {
        expect(usersRepository).toBeDefined();
    });

    it("should be defined configService", () => {
        expect(configService).toBeDefined();
    });

    it("should be defined jwtService", () => {
        expect(jwtService).toBeDefined();
    });

    it("should be defined jwtModelFactory", () => {
        expect(jwtModelFactory).toBeDefined();
    });

    it("should be defined authService", () => {
        expect(authService).toBeDefined();
    });

    describe("login", () => {
        it("should return a JWT token if the email and password are correct", async () => {
            const dto: AuthLoginDto = {
                email: studentUserStub.email,
                password: studentUserStub.password,
            };

            studentUserStub.validatePassword = jest.fn().mockResolvedValue(true);

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(jwtService, "signAsync").mockResolvedValue("jwt-token");

            const result = await authService.login(dto);

            expect(result.accessToken).toEqual("jwt-token");
            expect(result.refreshToken).toEqual("jwt-token");
        });

        it("should throw an error if the email is incorrect", async () => {
            const dto: AuthLoginDto = {
                email: studentUserStub.email,
                password: studentUserStub.password,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);

            await expect(authService.login(dto)).rejects.toThrow(
                new UnauthorizedException({ message: "Wrong credentials!" }),
            );
        });

        it("should throw an error if the password is incorrect", async () => {
            const dto: AuthLoginDto = {
                email: studentUserStub.email,
                password: studentUserStub.password,
            };

            studentUserStub.validatePassword = jest.fn().mockResolvedValue(false);

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(jwtService, "signAsync").mockResolvedValue("jwt-token");

            await expect(authService.login(dto)).rejects.toThrow(
                new UnauthorizedException({ message: "Wrong credentials!" }),
            );
        });
    });

    describe("logout", () => {
        it("should successfully logout", async () => {
            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "updateRefreshToken").mockResolvedValue(undefined);

            const result = await authService.logout(studentUserStub);

            expect(result).toBeUndefined();
        });

        it("should throw a NotFoundException when user is not found", async () => {
            jest.spyOn(usersRepository, "getById").mockResolvedValue(null);
            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                const result = await authService.logout(studentUserStub);

                expect(result).toBeUndefined();
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(err.message).toEqual(BaseErrorMessage.NOT_FOUND);
                expect(err).toBeInstanceOf(NotFoundException);
            }
        });
    });

    describe("refreshToken", () => {
        it("should successfully refresh token", async () => {
            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(jwtService, "signAsync").mockResolvedValue("jwt-token");
            jest.spyOn(usersRepository, "updateRefreshToken").mockResolvedValue(undefined);

            const result = await authService.refreshToken(studentUserStub);

            expect(result.accessToken).toEqual("jwt-token");
            expect(result.refreshToken).toEqual("jwt-token");
        });
    });

    describe("signUp", () => {
        it("should successfully create a user", async () => {
            const dto: AuthSignUpDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);
            jest.spyOn(usersManagementService, "signUpStudent").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "create").mockResolvedValue(studentUserStub);
            jest.spyOn(jwtService, "signAsync").mockResolvedValue("jwt-token");

            const result = await authService.signUp(dto);

            expect(result.accessToken).toEqual("jwt-token");
            expect(result.refreshToken).toEqual("jwt-token");
        });

        it("should throw a ConflictException when user already exists", async () => {
            const dto: AuthSignUpDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(usersManagementService, "signUpStudent").mockResolvedValue(studentUserStub);

            await expect(authService.signUp(dto)).rejects.toThrow(
                new ConflictException("User already exists"),
            );
        });
    });

    describe("validateJwt", () => {
        it("should successfully validate jwt", async () => {
            const jwtModel: JwtModel = {
                email: "test@gmail.com",
                id: 1,
                role: studentRoleStub.name,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);

            const result = await authService.validateJwt(jwtModel);

            expect(result).toEqual(studentUserStub);
        });

        it("should throw a UnauthorizedException when user is not found", async () => {
            const jwtModel: JwtModel = {
                email: "test@gmail.com",
                id: 1,
                role: studentRoleStub.name,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);

            await expect(authService.validateJwt(jwtModel)).rejects.toThrow(
                new UnauthorizedException({ message: "Invalid token" }),
            );
        });
    });

    describe("validateRefreshToken", () => {
        it("should successfully validate validateRefreshToken", async () => {
            const payload: JwtModel = {
                email: "test@gmail.com",
                id: 1,
                role: studentRoleStub.name,
            };
            const mockRefreshToken = "mockRefreshToken";
            studentUserStub.refreshToken = mockRefreshToken;

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            const result = await authService.validateRefreshToken(payload, mockRefreshToken);

            expect(result).toEqual(studentUserStub);
        });

        it("should throw a UnauthorizedException when user is not found", async () => {
            const payload: JwtModel = {
                email: "test@gmail.com",
                id: 1,
                role: studentRoleStub.name,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);

            await expect(
                authService.validateRefreshToken(payload, studentUserStub.refreshToken),
            ).rejects.toThrow(new UnauthorizedException({ message: "Invalid token" }));
        });

        it("should throw a UnauthorizedException when passwords dont't match", async () => {
            const payload: JwtModel = {
                email: "test@gmail.com",
                id: 1,
                role: studentRoleStub.name,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(
                authService.validateRefreshToken(payload, studentUserStub.refreshToken),
            ).rejects.toThrow(new UnauthorizedException({ message: "Invalid token" }));
        });
    });
});

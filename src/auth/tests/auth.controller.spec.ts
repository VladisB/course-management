import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { AuthViewModel } from "../models";
import { AuthSignUpDto } from "../dto";
import { Response } from "express";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn().mockResolvedValue(new AuthViewModel()),
                        signUp: jest.fn().mockResolvedValue(new AuthViewModel()),
                        updateRefresh: jest.fn().mockResolvedValue(new AuthViewModel()),
                        refreshToken: jest.fn().mockResolvedValue(new AuthViewModel()),
                        logout: jest.fn().mockResolvedValue(undefined),
                        version: jest.fn().mockResolvedValue("1.0.0"), // NOTE: Just for testing purposes
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("login", () => {
        it("should login a user", async () => {
            const dto = new AuthSignUpDto();
            const res = {
                cookie: jest.fn(),
            } as unknown as Response;

            const result = await authController.login(res, user);

            expect(result).toBeInstanceOf(AuthViewModel);
            expect(authService.login).toHaveBeenCalledWith(dto);
        });
    });

    describe("signUp", () => {
        it("should create a user", async () => {
            const dto = new CreateUserDto();
            const res = {
                cookie: jest.fn(),
            } as unknown as Response;

            const result = await authController.signUp(res, dto);

            expect(result).toBeInstanceOf(AuthViewModel);
            expect(authService.signUp).toHaveBeenCalledWith(dto);
        });
    });

    describe("updateRefresh", () => {
        it("should create a user", async () => {
            const res = {
                cookie: jest.fn(),
            } as unknown as Response;

            const result = await authController.updateRefresh(user, res);

            expect(result).toBeInstanceOf(AuthViewModel);
            expect(authService.refreshToken).toHaveBeenCalledWith(user);
        });
    });

    describe("logout", () => {
        it("should logout a user", async () => {
            const result = await authController.logout(user);

            expect(result).toBeUndefined();
            expect(authService.logout).toHaveBeenCalledWith(user);
        });
    });

    describe("version", () => {
        it("should return version", async () => {
            const result = await authController.version();

            expect(result).toEqual(expect.any(String));
        });
    });
});

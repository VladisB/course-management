import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
import { RolesGuard } from "../roles.guard";

describe("RolesGuard", () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn().mockReturnValue([]),
                    },
                },
            ],
        }).compile();

        rolesGuard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should be defined", () => {
        expect(rolesGuard).toBeDefined();
    });

    it("should allow if no roles are required", () => {
        const context = {
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { role: { name: "user" } },
                }),
            }),
        } as unknown as ExecutionContext;

        const result = rolesGuard.canActivate(context);
        expect(result).toBe(true);
    });

    it("should deny if user does not have the required role", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
        const context = {
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { role: { name: "user" } },
                }),
            }),
        } as unknown as ExecutionContext;

        const result = rolesGuard.canActivate(context);
        expect(result).toBe(false);
    });

    it("should allow if user has the required role", () => {
        jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["user"]);
        const context = {
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { role: { name: "user" } },
                }),
            }),
        } as unknown as ExecutionContext;

        const result = rolesGuard.canActivate(context);
        expect(result).toBe(true);
    });
});

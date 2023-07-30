import { RolesService } from "../roles.service";
import { IRolesRepository, RolesRepository } from "../roles.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "../entities/role.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { RoleViewModelFactory } from "../model-factories";
import { mockRolesRepository } from "./mocks";

describe("RolesModule", () => {
    const entityRepositoryToken = getRepositoryToken(Role);
    let moduleRef: TestingModule;

    beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
            providers: [
                RolesService,
                { provide: IRolesRepository, useClass: RolesRepository },
                RoleViewModelFactory,
                {
                    provide: entityRepositoryToken,
                    useValue: mockRolesRepository(),
                },
            ],
        }).compile();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should compile the Roles module", async () => {
        expect(moduleRef).toBeDefined();
    });

    it("should have RolesService as provider", async () => {
        expect(moduleRef.get(RolesService)).toBeInstanceOf(RolesService);
    });

    it("should have RolesRepository as provider", async () => {
        expect(moduleRef.get(IRolesRepository)).toBeInstanceOf(RolesRepository);
    });

    it("should have RoleViewModelFactory as provider", async () => {
        expect(moduleRef.get(IRolesRepository)).toBeInstanceOf(RolesRepository);
    });

    it("should have RolesController as controller", async () => {
        expect(moduleRef.get(RoleViewModelFactory)).toBeInstanceOf(RoleViewModelFactory);
    });
});

// NOTE: Remove this file. There are no testable logic.

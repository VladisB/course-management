import { RolesService } from "../roles.service";
import { IRolesRepository, RolesRepository } from "../roles.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "../entities/role.entity";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";
import { RolesViewModelFactory } from "../model-factories";

describe("RolesModule", () => {
    const entityRepositoryToken = getRepositoryToken(Role);
    let moduleRef: TestingModule;

    beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
            providers: [
                RolesService,
                { provide: IRolesRepository, useClass: RolesRepository },
                RolesViewModelFactory,
                {
                    provide: entityRepositoryToken,
                    useValue: createMock<Repository<Role>>(),
                },
            ],
        }).compile();
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

    it("should have RolesViewModelFactory as provider", async () => {
        expect(moduleRef.get(IRolesRepository)).toBeInstanceOf(RolesRepository);
    });

    it("should have RolesController as controller", async () => {
        expect(moduleRef.get(RolesViewModelFactory)).toBeInstanceOf(RolesViewModelFactory);
    });
});

// NOTE: Remove this file. There are no testable logic.

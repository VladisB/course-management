import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthModule } from "../../auth/auth.module";
import { Role } from "../entities/role.entity";
import { RolesController } from "../roles.controller";
import { RolesService } from "../roles.service";
import { mockRolesRepository } from "./mocks";

const USER_REPOSITORY_TOKEN = getRepositoryToken(Role);

describe("Roles Module", () => {
    it("should compile the module", async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                AuthModule,
                RolesService,
                { provide: USER_REPOSITORY_TOKEN, useFactory: mockRolesRepository },
            ],
        }).compile();

        expect(module).toBeDefined();
        expect(module.get(AuthModule)).toBeInstanceOf(AuthModule);
        expect(module.get(RolesController)).toBeInstanceOf(RolesController);
        expect(module.get(RolesService)).toBeInstanceOf(RolesService);

        //TODO: Try to test TypeOrmModule.forFeature([Role])
    });
});

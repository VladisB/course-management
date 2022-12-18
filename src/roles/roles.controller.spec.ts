import { Test, TestingModule } from "@nestjs/testing";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

const rolesMock = [
    {
        id: 2,
        name: "admin",
    },
    {
        id: 3,
        name: "student",
    },
];

const mockRolesService = {
    getRoles: jest.fn().mockResolvedValue(rolesMock),
    createRole: jest.fn((dto: CreateRoleDto) => {
        const role = new Role();
        role.name = dto.name;
        role.id = 1;

        return role;
    }),
};

describe("RolesService", () => {
    let controller: RolesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [RolesService],
        })
            .overrideProvider(RolesService)
            .useValue(mockRolesService)
            .compile();

        controller = module.get<RolesController>(RolesController);
    });

    it("RolesService should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create a role", () => {
        it("should create new role", async () => {
            const createRoleDto: CreateRoleDto = {
                name: "mockRole",
            };

            expect(controller.create(createRoleDto)).toEqual({
                id: expect.any(Number),
                name: createRoleDto.name,
            });
            expect(controller.create(createRoleDto)).toBeInstanceOf(Role);
        });
    });

    describe("Get roles", () => {
        it("successfully retrieve roles", async () => {
            const roles = await controller.getRoles();

            expect(roles).toEqual(rolesMock);
        });
    });
});

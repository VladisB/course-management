import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

//TODO: Share mocks between files
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

const mockRoleRepository = () => ({
    getAllUsers: jest.fn(),
    findOne: jest.fn().mockResolvedValue(rolesMock[0]),
    findOneBy: jest.fn().mockResolvedValue(rolesMock[0]),
    find: jest.fn().mockResolvedValue(rolesMock),
    create: jest.fn((dto: CreateRoleDto) => {
        const role = new Role();
        role.name = dto.name;

        return role;
    }),
    save: jest.fn().mockImplementation((role: Role): Promise<Role> => {
        role.id = 1;
        return Promise.resolve(role);
    }),
});

const USER_REPOSITORY_TOKEN = getRepositoryToken(Role);

describe("Roles Module", () => {
    it("should compile the module", async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                AuthModule,
                RolesService,
                { provide: USER_REPOSITORY_TOKEN, useFactory: mockRoleRepository },
            ],
        }).compile();

        expect(module).toBeDefined();
        expect(module.get(AuthModule)).toBeInstanceOf(AuthModule);
        expect(module.get(RolesController)).toBeInstanceOf(RolesController);
        expect(module.get(RolesService)).toBeInstanceOf(RolesService);

        //TODO: Try to test TypeOrmModule.forFeature([Role])
    });
});

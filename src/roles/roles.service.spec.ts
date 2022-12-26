import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./role.entity";
import { Role as RoleEnum } from "./roles.enum";
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

const mockRolesRepository = () => ({
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

describe("RolesService", () => {
    let rolesService: RolesService;
    let rolesRepository: Repository<Role>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesService,
                { provide: USER_REPOSITORY_TOKEN, useFactory: mockRolesRepository },
            ],
        }).compile();

        rolesService = await module.get<RolesService>(RolesService);
        rolesRepository = module.get(USER_REPOSITORY_TOKEN);
    });

    it("RolesService should be defined", () => {
        expect(rolesService).toBeDefined();
    });

    it("rolesRepository should be defined", () => {
        expect(rolesRepository).toBeDefined();
    });

    describe("create a role", () => {
        it("should save the new role", async () => {
            const createRoleDto: CreateRoleDto = {
                name: "mockRole",
            };

            const result = await rolesService.createRole(createRoleDto);
            expect(result).toEqual({
                id: expect.any(Number),
                name: createRoleDto.name,
            });
            expect(result).toBeInstanceOf(Role);
        });

        //TODO: Cover error case
    });

    describe("get role by name", () => {
        it("calls getRoleByName and successfully retrieve and return the role", async () => {
            const repoSpy = jest.spyOn(rolesRepository, "findOne");
            const adminEntity = { ...rolesMock[0] };

            expect(rolesService.getRoleByName(RoleEnum.Admin)).resolves.toEqual(adminEntity);
            expect(repoSpy).toBeCalledWith({ where: { name: RoleEnum.Admin } });
        });

        it("throws an error if role is not found ", async () => {
            jest.spyOn(rolesService, "getRoleByName").mockRejectedValue(NotFoundException);

            await expect(rolesService.getRoleByName("unexisted role")).rejects.toThrow();
        });
    });

    describe("get role by id", () => {
        it("calls getRoleById and successfully retrieve and return the role", async () => {
            const repoSpy = jest.spyOn(rolesRepository, "findOneBy");
            const adminEntity = { ...rolesMock[0] };

            expect(rolesService.getRoleById(1)).resolves.toEqual(adminEntity);
            expect(repoSpy).toBeCalledWith({ id: 1 });
        });

        it("throws an error if role is not found ", async () => {
            jest.spyOn(rolesService, "getRoleById").mockRejectedValue(NotFoundException);

            await expect(rolesService.getRoleById(999999)).rejects.toThrow();
        });
    });

    describe("Get all roles from the repository", () => {
        it("should return an array of roles", async () => {
            const roles = await rolesService.getRoles();

            expect(roles).toEqual(rolesMock);
        });
    });
});

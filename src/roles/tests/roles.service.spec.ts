import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage, RoleName } from "@app/common/enum";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "../dto/create-role.dto";
import { IRolesRepository } from "../roles.repository";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { Role } from "../entities/role.entity";
import { RolesService } from "../roles.service";
import { RoleViewModelFactory } from "../model-factories";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { User } from "@app/users/entities/user.entity";
import { adminRoleStub, rolesMock } from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { mockRolesRepository } from "./mocks";

const queryBuilderMock = mockQueryBuilder<Role>(rolesMock);

describe("RolesService", () => {
    let rolesService: RolesService;
    let rolesRepository: IRolesRepository;
    let rolesViewModelFactory: RoleViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<Role>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: IRolesRepository,
                    useValue: mockRolesRepository(),
                },
                { provide: RoleViewModelFactory, useClass: RoleViewModelFactory },
            ],
        }).compile();

        rolesService = module.get<RolesService>(RolesService);
        rolesRepository = module.get(IRolesRepository);
        rolesViewModelFactory = module.get(RoleViewModelFactory);
        queryBuilder = queryBuilderMock;
        user = new User();

        jest.clearAllMocks();
    });

    it("RolesService should be defined", () => {
        expect(rolesService).toBeDefined();
    });

    it("rolesRepository should be defined", () => {
        expect(rolesRepository).toBeDefined();
    });

    it("rolesViewModelFactory should be defined", () => {
        expect(rolesViewModelFactory).toBeDefined();
    });

    describe("create a role", () => {
        it("should save the new role", async () => {
            const createRoleDto: CreateRoleDto = {
                name: "mockRole",
            };

            const result = await rolesService.createRole(createRoleDto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                name: createRoleDto.name,
            });
        });

        it("should throw an error if role already exists", async () => {
            const createRoleDto: CreateRoleDto = {
                name: RoleName.Admin,
            };

            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(
                rolesMock.find((r) => r.name === createRoleDto.name),
            );

            await expect(rolesService.createRole(createRoleDto, user)).rejects.toThrowError(
                new ConflictException(`Role with name ${createRoleDto.name} already exists.`),
            );
        });
    });

    describe("get role by name", () => {
        it("calls getRoleByName and successfully retrieve and return the role", async () => {
            const repoSpy = jest
                .spyOn(rolesRepository, "getByName")
                .mockResolvedValue(rolesMock[0]);

            expect(rolesService.getRoleByName(RoleName.Admin)).resolves.toEqual(adminRoleStub);
            expect(repoSpy).toBeCalledWith(RoleName.Admin);
        });
    });

    describe("get role by id", () => {
        it("should return role", async () => {
            const repoSpy = jest.spyOn(rolesRepository, "getById").mockResolvedValue(rolesMock[0]);

            expect(rolesService.getRole(1)).resolves.toEqual(adminRoleStub);
            expect(repoSpy).toBeCalledWith(1);
        });

        it("should throw NotFoundException if role does not exist", async () => {
            const roleId = 99;

            await expect(rolesService.getRole(roleId)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(rolesRepository.getById).toHaveBeenCalledWith(roleId);
        });
    });

    describe("delete role by id", () => {
        it("should delete role", async () => {
            const repoSpy = jest.spyOn(rolesRepository, "getById").mockResolvedValue(rolesMock[0]);
            const roleId = 1;

            expect(rolesService.deleteRole(roleId)).resolves.toBeUndefined();
            expect(repoSpy).toBeCalledWith(roleId);
        });

        it("should throw NotFoundException if role to delete does not exist", async () => {
            const roleId = 99;

            await expect(rolesService.deleteRole(roleId)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(rolesRepository.getById).toHaveBeenCalledWith(roleId);
        });
    });

    describe("get all roles from the repository", () => {
        it("should return a list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(rolesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Role>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                rolesMock,
                rolesMock.length,
            ]);

            jest.spyOn(rolesViewModelFactory, "initRoleListViewModel").mockReturnValue(rolesMock);

            const result = await rolesService.getRoles(queryParams);

            const resultNames = result.records.map((item) => item.name);
            const mockNames = rolesMock.map((role) => role.name);

            expect(result.totalRecords).toEqual(rolesMock.length);
            expect(resultNames).toEqual(mockNames);
        });

        it("should return a empty list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(rolesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Role>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);

            jest.spyOn(rolesViewModelFactory, "initRoleListViewModel").mockReturnValue([]);

            const result = await rolesService.getRoles(queryParams);

            const resultNames = result.records.map((item) => item.name);

            expect(result.totalRecords).toEqual(0);
            expect(resultNames).toEqual([]);
        });
    });

    describe("update role", () => {
        it("should return an updated role", async () => {
            const dto: UpdateRoleDto = {
                name: "mockRole",
            };

            const roleId = 1;

            jest.spyOn(rolesRepository, "getById").mockResolvedValue(
                rolesMock.find((r) => r.id === roleId),
            );

            const result = await rolesService.updateRole(roleId, dto, user);

            expect(result).toEqual({
                id: roleId,
                name: dto.name,
            });
        });

        it("should throw ConflictException if role name is not unique", async () => {
            const dto: UpdateRoleDto = {
                name: RoleName.Admin,
            };

            const roleId = 1;

            jest.spyOn(rolesRepository, "getById").mockResolvedValue(
                rolesMock.find((r) => r.id === roleId),
            );

            const spyRepo = jest
                .spyOn(rolesRepository, "getByName")
                .mockResolvedValue(rolesMock.find((r) => r.name === dto.name));

            await expect(rolesService.updateRole(roleId, dto, user)).rejects.toThrow(
                new ConflictException(`Role with name ${dto.name} already exists.`),
            );
            expect(spyRepo).toHaveBeenCalledWith(dto.name);
        });

        it("should throw NotFoundException since updated role not found", async () => {
            const dto: UpdateRoleDto = {
                name: "mockRole",
            };

            const roleId = 99;

            expect(rolesService.updateRole(roleId, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(rolesRepository.getById).toHaveBeenCalledWith(roleId);
        });
    });
});

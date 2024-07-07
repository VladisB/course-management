import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RolesRepository } from "../roles.repository";
import { Role } from "../entities/role.entity";
import { Repository } from "typeorm";
import { adminRoleStub } from "@app/common/test/stubs";
import { BaseErrorMessage, RoleName } from "@app/common/enum";
import { mockRolesRepository } from "./mocks";

describe("RolesRepository", () => {
    let rolesRepository: RolesRepository;
    const entityRepositoryToken = getRepositoryToken(Role);
    let entityRepository: Repository<Role>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RolesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockRolesRepository(),
                },
            ],
        }).compile();

        rolesRepository = moduleRef.get<RolesRepository>(RolesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getByName", () => {
        it("should return the role if it exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(adminRoleStub);

            const result = await rolesRepository.getByName(RoleName.Admin);

            expect(result).toEqual(adminRoleStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: RoleName.Admin },
            });
        });

        it("should return null if role doesn't exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);
            const roleName = "test role name";

            const result = await rolesRepository.getByName(roleName);

            expect(result).toEqual(null);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: roleName },
            });
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const roleId = 1;

            jest.spyOn(entityRepository, "findOneBy").mockResolvedValue(adminRoleStub);

            const result = await rolesRepository.getById(roleId);

            expect(entityRepository.findOneBy).toHaveBeenCalledWith({ id: roleId });
            expect(result).toEqual(adminRoleStub);
        });

        it("should return null if entity not found", async () => {
            const roleId = 99;

            jest.spyOn(entityRepository, "findOneBy").mockResolvedValue(null);

            const result = await rolesRepository.getById(roleId);

            expect(entityRepository.findOneBy).toHaveBeenCalledWith({ id: roleId });
            expect(result).toEqual(null);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            rolesRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith("role");
        });
    });

    describe("create role", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(adminRoleStub);

            const result = await rolesRepository.create(adminRoleStub);

            expect(entityRepository.save).toHaveBeenCalledWith(adminRoleStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(adminRoleStub);
        });
    });

    describe("update role", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(adminRoleStub);

            const result = await rolesRepository.update(adminRoleStub);

            expect(entityRepository.save).toHaveBeenCalledWith(adminRoleStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(adminRoleStub);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            adminRoleStub.id = 99;

            try {
                await rolesRepository.update(adminRoleStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const roleId = 1;

            await rolesRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(roleId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const roleId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await rolesRepository.deleteById(roleId);

            expect(entityRepository.delete).toHaveBeenCalledWith(roleId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

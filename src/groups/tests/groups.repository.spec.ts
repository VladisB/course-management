import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { groupMockList, groupStub } from "@app/common/test/stubs";
import { mockGroupsRepository } from "./mocks";
import { GroupsRepository } from "../groups.repository";
import { Group } from "../entities/group.entity";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { BaseErrorMessage } from "@app/common/enum";

const tableName = "group";
const queryBuilderMock = mockQueryBuilder<Group>(groupMockList);

describe("GroupsRepository", () => {
    let groupsRepository: GroupsRepository;
    const entityRepositoryToken = getRepositoryToken(Group);
    let entityRepository: Repository<Group>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GroupsRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockGroupsRepository(),
                },
            ],
        }).compile();

        groupsRepository = moduleRef.get<GroupsRepository>(GroupsRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getByName", () => {
        it("should return the group if it exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupStub);

            const result = await groupsRepository.getByName(groupStub.name);

            expect(result).toEqual(groupStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: groupStub.name },
            });
        });

        it("should return null if group doesn't exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);
            const groupName = "test group name";

            const result = await groupsRepository.getByName(groupName);

            expect(result).toEqual(null);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: groupName },
            });
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupStub);

            const result = await groupsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    groupCourses: {
                        course: true,
                    },
                    faculty: true,
                },
            });
            expect(result).toEqual(groupStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await groupsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    groupCourses: {
                        course: true,
                    },
                    faculty: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("trxGetById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupStub);

            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(groupStub),
                    findOne: jest.fn().mockResolvedValue(groupStub),
                },
            } as any;

            const result = await groupsRepository.trxGetById(trx, id);

            expect(trx.manager.findOne).toHaveBeenCalledWith(Group, {
                where: {
                    id,
                },
                relations: {
                    groupCourses: {
                        course: true,
                    },
                    faculty: true,
                },
            });
            expect(result).toEqual(groupStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await groupsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    groupCourses: {
                        course: true,
                    },
                    faculty: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn(() => localQueryBuilderMock),
                leftJoinAndSelect: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Group>,
            );

            groupsRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "group.faculty",
                "faculty",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "group.groupCourses",
                "groupCourses",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "groupCourses.course",
                "course",
            );
        });
    });

    describe("create a group", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(groupStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupStub);

            const result = await groupsRepository.create(groupStub);

            expect(entityRepository.save).toHaveBeenCalledWith(groupStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(groupStub);
        });
    });

    describe("update a group", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const updatedGroup = groupStub;
            updatedGroup.name = "updated name";

            jest.spyOn(entityRepository, "save").mockResolvedValue(updatedGroup);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(updatedGroup);

            const result = await groupsRepository.update(updatedGroup);

            expect(entityRepository.save).toHaveBeenCalledWith(updatedGroup);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedGroup);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            groupStub.id = 99;

            try {
                await groupsRepository.update(groupStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("trxUpdate a group", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const updatedGroup = groupStub;
            updatedGroup.name = "updated name";

            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(groupStub),
                    findOne: jest.fn().mockResolvedValue(groupStub),
                },
            } as any;

            const result = await groupsRepository.trxUpdate(trx, updatedGroup);

            expect(trx.manager.save).toHaveBeenCalledWith(updatedGroup);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(trx.manager.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedGroup);
        });

        it("should call save on the repository with wrong id", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            groupStub.id = 1;

            try {
                await groupsRepository.trxUpdate(trx, groupStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const id = 1;

            await groupsRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(id);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await groupsRepository.deleteById(id);

            expect(entityRepository.delete).toHaveBeenCalledWith(id);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

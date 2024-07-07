import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { groupCoursesMockList, groupCoursesStub } from "@app/common/test/stubs";
import { mockGroupCoursesRepository } from "./mocks";
import { GroupCourses } from "../entities/group-courses.entity";
import { GroupCoursesRepository } from "../group-courses.repository";

describe("GroupCoursesRepository", () => {
    let groupCoursesRepository: GroupCoursesRepository;
    const entityRepositoryToken = getRepositoryToken(GroupCourses);
    let entityRepository: Repository<GroupCourses>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GroupCoursesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockGroupCoursesRepository(),
                },
            ],
        }).compile();

        groupCoursesRepository = moduleRef.get<GroupCoursesRepository>(GroupCoursesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupCoursesStub);

            const result = await groupCoursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(groupCoursesStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await groupCoursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getAllByGroupId", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const groupId = 1;

            jest.spyOn(entityRepository, "find").mockResolvedValue(groupCoursesMockList);

            const result = await groupCoursesRepository.getAllByGroupId(groupId);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    groupId,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(groupCoursesMockList);
        });

        it("should return null if entity not found", async () => {
            const groupId = 99;

            jest.spyOn(entityRepository, "find").mockResolvedValue(null);

            const result = await groupCoursesRepository.getAllByGroupId(groupId);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    groupId,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("trxGetAllByGroupId", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const groupId = 1;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue(groupCoursesMockList),
                },
            } as any;

            const result = await groupCoursesRepository.trxGetAllByGroupId(trx, groupId);

            expect(trx.manager.find).toHaveBeenCalledWith(GroupCourses, {
                where: {
                    groupId,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(groupCoursesMockList);
        });

        it("should return null if entity not found", async () => {
            const groupId = 99;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const result = await groupCoursesRepository.trxGetAllByGroupId(trx, groupId);

            expect(trx.manager.find).toHaveBeenCalledWith(GroupCourses, {
                where: {
                    groupId,
                },
                relations: {
                    course: true,
                    group: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("create a group courses", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(groupCoursesStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(groupCoursesStub);

            const result = await groupCoursesRepository.create(groupCoursesStub);

            expect(entityRepository.save).toHaveBeenCalledWith(groupCoursesStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(groupCoursesStub);
        });
    });

    describe("trxBulkCreate a group courses", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(groupCoursesMockList),
                },
            } as any;

            const result = await groupCoursesRepository.trxBulkCreate(trx, groupCoursesMockList);

            expect(trx.manager.save).toHaveBeenCalledWith(groupCoursesMockList);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(groupCoursesMockList);
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const id = 1;

            await groupCoursesRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(id);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await groupCoursesRepository.deleteById(id);

            expect(entityRepository.delete).toHaveBeenCalledWith(id);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("trxDeleteByGroupId", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            const id = 1;

            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(undefined),
                },
            } as any;

            await groupCoursesRepository.trxDeleteByGroupId(trx, id);

            expect(trx.manager.delete).toHaveBeenCalledWith(GroupCourses, {
                groupId: id,
            });
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const id = 99;

            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(undefined),
                },
            } as any;

            const result = await groupCoursesRepository.trxDeleteByGroupId(trx, id);

            expect(trx.manager.delete).toHaveBeenCalledWith(GroupCourses, {
                groupId: id,
            });
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

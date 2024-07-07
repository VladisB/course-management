import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import {
    courseInstructorsCSStub,
    courseInstructorsMockList,
    lessonMockList,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { mockCourseInstructorsRepository } from "./mocks";
import { CourseInstructorsRepository } from "../course-instructors.repository";
import { CourseInstructors } from "../entities/course-instructors.entity";

const tableName = "course_instructors";
const queryBuilderMock = mockQueryBuilder<CourseInstructors>(lessonMockList);

describe("CourseInstructorsRepository", () => {
    let courseInstructorsRepository: CourseInstructorsRepository;

    const entityRepositoryToken = getRepositoryToken(CourseInstructors);
    let entityRepository: Repository<CourseInstructors>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CourseInstructorsRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockCourseInstructorsRepository(),
                },
            ],
        }).compile();

        courseInstructorsRepository = moduleRef.get<CourseInstructorsRepository>(
            CourseInstructorsRepository,
        );
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseInstructorsCSStub);

            const result = await courseInstructorsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    id,
                },
            });
            expect(result).toEqual(courseInstructorsCSStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await courseInstructorsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    id,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getByIdList", () => {
        it("should call find on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "find").mockResolvedValue(courseInstructorsMockList);

            const idList = courseInstructorsMockList.map((entity) => entity.id);
            const result = await courseInstructorsRepository.getByIdList(idList);

            expect(entityRepository.find).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    id: In(idList),
                },
            });
            expect(result).toEqual(courseInstructorsMockList);
        });

        it("should return empty array if entities not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "find").mockResolvedValue([]);

            const idList = courseInstructorsMockList.map((entity) => entity.id);
            const result = await courseInstructorsRepository.getByIdList(idList);

            expect(entityRepository.find).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    id: In(idList),
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("getByIdWithFullDetails", () => {
        it("should call createQueryBuilder on the repository with the correct parameters", async () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn(() => localQueryBuilderMock),
                where: jest.fn(() => localQueryBuilderMock),
                innerJoinAndMapMany: jest.fn(() => localQueryBuilderMock),
                getOne: jest.fn(() => courseInstructorsCSStub),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<CourseInstructors>,
            );

            const id = 1;
            const result = await courseInstructorsRepository.getByIdWithFullDetails(id);

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.course`,
                "course",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith(`${tableName}.id = :id`, {
                id,
            });
            expect(localQueryBuilderMock.innerJoinAndMapMany).toHaveBeenCalledWith(
                "course.courseInstructors",
                "course_instructors",
                "courseInstructors",
                "courseInstructors.courseId = course.id",
            );
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "courseInstructors.instructor",
                "user",
            );
            expect(localQueryBuilderMock.getOne).toHaveBeenCalled();
            expect(result).toEqual(courseInstructorsCSStub);
        });

        it("should return null if entities not found", async () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn(() => localQueryBuilderMock),
                where: jest.fn(() => localQueryBuilderMock),
                innerJoinAndMapMany: jest.fn(() => localQueryBuilderMock),
                getOne: jest.fn(() => null),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<CourseInstructors>,
            );

            const id = 1;
            const result = await courseInstructorsRepository.getByIdWithFullDetails(id);

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.course`,
                "course",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith(`${tableName}.id = :id`, {
                id,
            });
            expect(localQueryBuilderMock.innerJoinAndMapMany).toHaveBeenCalledWith(
                "course.courseInstructors",
                "course_instructors",
                "courseInstructors",
                "courseInstructors.courseId = course.id",
            );
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "courseInstructors.instructor",
                "user",
            );
            expect(localQueryBuilderMock.getOne).toHaveBeenCalled();
            expect(result).toEqual(null);
        });
    });

    describe("getByDetails", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "find").mockResolvedValue(courseInstructorsMockList);

            const instructorIdList = courseInstructorsMockList.map((entity) => entity.instructorId);
            const courseId = courseInstructorsMockList[0].courseId;

            const result = await courseInstructorsRepository.getByDetails(
                instructorIdList,
                courseId,
            );

            expect(entityRepository.find).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    courseId,
                    instructorId: In(instructorIdList),
                },
            });
            expect(result).toEqual(courseInstructorsMockList);
        });

        it("should return empty array if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "find").mockResolvedValue([]);

            const instructorIdList = courseInstructorsMockList.map((entity) => entity.instructorId);
            const courseId = courseInstructorsMockList[0].courseId;

            const result = await courseInstructorsRepository.getByDetails(
                instructorIdList,
                courseId,
            );

            expect(entityRepository.find).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    courseId,
                    instructorId: In(instructorIdList),
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<CourseInstructors>,
            );

            courseInstructorsRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.course`,
                "course",
            );
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.instructor`,
                "user",
            );
        });
    });

    describe("create a course instructor", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(courseInstructorsCSStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseInstructorsCSStub);

            const result = await courseInstructorsRepository.create(courseInstructorsCSStub);

            expect(entityRepository.save).toHaveBeenCalledWith(courseInstructorsCSStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(expect.any(Object));
            expect(result.courseId).toEqual(expect.any(Number));
            expect(result.instructor).toEqual(expect.any(Object));
            expect(result.instructorId).toEqual(expect.any(Number));
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });
    });

    describe("bulk create a course instructor", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(
                courseInstructorsMockList as any,
            );
            jest.spyOn(entityRepository, "find").mockResolvedValue(courseInstructorsMockList);

            const result = await courseInstructorsRepository.bulkCreate(courseInstructorsMockList);

            const firstCourseInstructor = courseInstructorsMockList[0];
            const resultItem = result.find(
                (i) =>
                    i.course.id === firstCourseInstructor.course.id &&
                    i.instructor.id === firstCourseInstructor.instructor.id,
            );

            expect(entityRepository.save).toHaveBeenCalledWith(courseInstructorsMockList);
            expect(entityRepository.find).toHaveBeenCalledWith({
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    id: In(courseInstructorsMockList.map((i) => i.id)),
                },
            });
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result.length).toEqual(courseInstructorsMockList.length);
            expect(resultItem.id).toEqual(expect.any(Number));
            expect(resultItem.course).toEqual(expect.any(Object));
            expect(resultItem.courseId).toEqual(expect.any(Number));
            expect(resultItem.instructor).toEqual(expect.any(Object));
            expect(resultItem.instructorId).toEqual(expect.any(Number));
            expect(resultItem.createdAt).toEqual(expect.any(Date));
            expect(resultItem.modifiedAt).toEqual(expect.any(Date));
        });
    });

    describe("trxBulkCreate course-instructors", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(courseInstructorsMockList),
                },
            } as any;

            const result = await courseInstructorsRepository.trxBulkCreate(
                trx,
                courseInstructorsMockList,
            );

            const firstStubItem = courseInstructorsMockList.find((i) => i);
            const resultItem = result.find(
                (i) =>
                    i.instructorId === firstStubItem.instructorId &&
                    i.courseId === firstStubItem.courseId,
            );

            expect(trx.manager.save).toHaveBeenCalledWith(courseInstructorsMockList);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(resultItem).toEqual(firstStubItem);
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const entityId = 1;

            await courseInstructorsRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await courseInstructorsRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("trxDeleteByIdList", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const entityId = 1;

            await courseInstructorsRepository.trxDeleteByIdList(trx, [entityId]);

            expect(trx.manager.delete).toHaveBeenCalledWith(CourseInstructors, {
                id: In([entityId]),
            });
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
        });

        it("should return undefined if entity doesn't exist", async () => {
            const entityId = 99;

            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(undefined),
                },
            } as any;

            const result = await courseInstructorsRepository.trxDeleteByIdList(trx, [entityId]);

            expect(trx.manager.delete).toHaveBeenCalledWith(CourseInstructors, {
                id: In([entityId]),
            });
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("trxGetAllByCourse", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const courseId = 1;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue(courseInstructorsMockList),
                },
            } as any;

            const result = await courseInstructorsRepository.trxGetAllByCourseId(trx, courseId);

            expect(trx.manager.find).toHaveBeenCalledWith(CourseInstructors, {
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    courseId,
                },
            });
            expect(result).toEqual(courseInstructorsMockList);
        });

        it("should return empty array if entity not found", async () => {
            const courseId = 1;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue([]),
                },
            } as any;

            const result = await courseInstructorsRepository.trxGetAllByCourseId(trx, courseId);

            expect(trx.manager.find).toHaveBeenCalledWith(CourseInstructors, {
                relations: {
                    course: true,
                    instructor: true,
                },
                where: {
                    courseId,
                },
            });
            expect(result).toEqual([]);
        });
    });
});

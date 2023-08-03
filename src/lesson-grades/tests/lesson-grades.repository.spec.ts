import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { lessonGradesMockList, lessonGradesStub, lessonMockList } from "@app/common/test/stubs";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { LessonGradesRepository } from "../lesson-grades.repository";
import { mockLessonGradesRepository } from "./mocks";
import { LessonGrades } from "../entities/lesson-grade.entity";
import { BaseErrorMessage } from "@app/common/enum";

const tableName = "lesson_grades";
const queryBuilderMock = mockQueryBuilder<LessonGrades>(lessonMockList);

describe("LessonGradesRepository", () => {
    let lessonGradesRepository: LessonGradesRepository;

    const entityRepositoryToken = getRepositoryToken(LessonGrades);
    let entityRepository: Repository<LessonGrades>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                LessonGradesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockLessonGradesRepository(),
                },
            ],
        }).compile();

        lessonGradesRepository = moduleRef.get<LessonGradesRepository>(LessonGradesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonGradesStub);

            const result = await lessonGradesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    createdBy: true,
                    modifiedBy: true,
                    student: true,
                    lesson: {
                        course: true,
                    },
                },
            });
            expect(result).toEqual(lessonGradesStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await lessonGradesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    createdBy: true,
                    modifiedBy: true,
                    student: true,
                    lesson: {
                        course: true,
                    },
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getByLesson", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const studentId = 1;
            const lessonId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonGradesStub);

            const result = await lessonGradesRepository.getByLesson(lessonId, studentId);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    lesson: { id: lessonId },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual(lessonGradesStub);
        });

        it("should return null if entity not found", async () => {
            const studentId = 1;
            const lessonId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await lessonGradesRepository.getByLesson(lessonId, studentId);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    lesson: { id: lessonId },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("trxGetById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(lessonGradesStub),
                },
            } as any;

            const result = await lessonGradesRepository.trxGetById(trx, id);

            expect(trx.manager.findOne).toHaveBeenCalledWith(LessonGrades, {
                where: {
                    id,
                },
                relations: {
                    createdBy: true,
                    modifiedBy: true,
                    student: true,
                    lesson: {
                        course: true,
                    },
                },
            });
            expect(result).toEqual(lessonGradesStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const result = await lessonGradesRepository.trxGetById(trx, id);

            expect(trx.manager.findOne).toHaveBeenCalledWith(LessonGrades, {
                where: {
                    id,
                },
                relations: {
                    createdBy: true,
                    modifiedBy: true,
                    student: true,
                    lesson: {
                        course: true,
                    },
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
                localQueryBuilderMock as any as SelectQueryBuilder<LessonGrades>,
            );

            lessonGradesRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.student`,
                "student",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.lesson`,
                "lesson",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.createdBy`,
                "instructorCreatedBy",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.modifiedBy`,
                "instructorModifiedBy",
            );
        });
    });

    describe("create a lesson grades", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(lessonGradesStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonGradesStub);

            const result = await lessonGradesRepository.create(lessonGradesStub);

            expect(entityRepository.save).toHaveBeenCalledWith(lessonGradesStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                id: expect.any(Number),
                lesson: lessonGradesStub.lesson,
                student: lessonGradesStub.student,
                grade: lessonGradesStub.grade,
                createdBy: lessonGradesStub.createdBy,
                modifiedBy: lessonGradesStub.createdBy,
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
        });
    });

    describe("trxCreate a lesson grades", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(lessonGradesStub),
                    findOne: jest.fn().mockResolvedValue(lessonGradesStub),
                },
            } as any;

            const result = await lessonGradesRepository.trxCreate(trx, lessonGradesStub);

            expect(trx.manager.save).toHaveBeenCalledWith(lessonGradesStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                id: expect.any(Number),
                lesson: lessonGradesStub.lesson,
                student: lessonGradesStub.student,
                grade: lessonGradesStub.grade,
                createdBy: lessonGradesStub.createdBy,
                modifiedBy: lessonGradesStub.createdBy,
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const entityId = 1;

            await lessonGradesRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await lessonGradesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("trxDeleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const entityId = 1;

            await lessonGradesRepository.trxDeleteById(trx, 1);

            expect(trx.manager.delete).toHaveBeenCalledWith(LessonGrades, entityId);
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
        });

        it("should return undefined if entity doesn't exist", async () => {
            const entityId = 99;

            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(undefined),
                },
            } as any;

            const result = await lessonGradesRepository.trxDeleteById(trx, entityId);

            expect(trx.manager.delete).toHaveBeenCalledWith(LessonGrades, entityId);
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("getAllByCourse", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const studentId = 1;
            const courseId = 1;

            jest.spyOn(entityRepository, "find").mockResolvedValue(lessonGradesMockList);

            const result = await lessonGradesRepository.getAllByCourse(courseId, studentId);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    lesson: { course: { id: courseId } },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual(lessonGradesMockList);
        });

        it("should return null if entity not found", async () => {
            const studentId = 1;
            const courseId = 1;

            jest.spyOn(entityRepository, "find").mockResolvedValue([]);

            const result = await lessonGradesRepository.getAllByCourse(courseId, studentId);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    lesson: { course: { id: courseId } },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("trxGetAllByCourse", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const studentId = 1;
            const courseId = 1;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue(lessonGradesMockList),
                },
            } as any;

            const result = await lessonGradesRepository.trxGetAllByCourse(trx, courseId, studentId);

            expect(trx.manager.find).toHaveBeenCalledWith(LessonGrades, {
                where: {
                    lesson: { course: { id: courseId } },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual(lessonGradesMockList);
        });

        it("should return null if entity not found", async () => {
            const studentId = 1;
            const courseId = 1;

            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue([]),
                },
            } as any;

            const result = await lessonGradesRepository.trxGetAllByCourse(trx, courseId, studentId);

            expect(trx.manager.find).toHaveBeenCalledWith(LessonGrades, {
                where: {
                    lesson: { course: { id: courseId } },
                    student: { id: studentId },
                },
                relations: {
                    createdBy: true,
                    student: true,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("update lesson grades", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(lessonGradesStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonGradesStub);

            const result = await lessonGradesRepository.update(lessonGradesStub);

            expect(entityRepository.save).toHaveBeenCalledWith(lessonGradesStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(lessonGradesStub);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            lessonGradesStub.id = 999;

            try {
                await lessonGradesRepository.update(lessonGradesStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("trxUpdate lesson grades", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(lessonGradesStub),
                    save: jest.fn().mockResolvedValue(lessonGradesStub),
                },
            } as any;

            const result = await lessonGradesRepository.trxUpdate(trx, lessonGradesStub);

            expect(trx.manager.save).toHaveBeenCalledWith(lessonGradesStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(lessonGradesStub);
        });

        it("should call save on the repository with wrong id", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(lessonGradesStub),
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            lessonGradesStub.id = 999;

            try {
                await lessonGradesRepository.trxUpdate(trx, lessonGradesStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });
});

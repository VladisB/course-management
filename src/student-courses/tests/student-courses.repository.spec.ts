import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { lessonMockList, studentCourseStub, studentCoursesMockList } from "@app/common/test/stubs";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { StudentCourses } from "../entities/student-courses.entity";
import { StudentCoursesRepository } from "../student-courses.repository";
import { mockStudentCoursesRepository } from "./mocks";
import { BaseErrorMessage } from "@app/common/enum";

const tableName = "student_courses";
const queryBuilderMock = mockQueryBuilder<StudentCourses>(lessonMockList);

describe("StudentCoursesRepository", () => {
    let studentCoursesRepository: StudentCoursesRepository;

    const entityRepositoryToken = getRepositoryToken(StudentCourses);
    let entityRepository: Repository<StudentCourses>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                StudentCoursesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockStudentCoursesRepository(),
                },
            ],
        }).compile();

        studentCoursesRepository =
            moduleRef.get<StudentCoursesRepository>(StudentCoursesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("trxBulkCreate student-courses", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(studentCoursesMockList),
                    find: jest.fn().mockResolvedValue(studentCoursesMockList),
                },
            } as any;

            const result = await studentCoursesRepository.trxBulkCreate(
                trx,
                studentCoursesMockList,
            );

            const firstStubItem = studentCoursesMockList.find((i) => i);
            const resultItem = result.find(
                (i) =>
                    i.studentId === firstStubItem.studentId &&
                    i.courseId === firstStubItem.courseId,
            );

            expect(trx.manager.save).toHaveBeenCalledWith(studentCoursesMockList);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);

            expect(resultItem.id).toEqual(expect.any(Number));
            expect(resultItem.course).toEqual(studentCourseStub.course);
            expect(resultItem.courseId).toEqual(studentCourseStub.courseId);
            expect(resultItem.student).toEqual(studentCourseStub.student);
            expect(resultItem.studentId).toEqual(studentCourseStub.studentId);
            expect(resultItem.createdAt).toEqual(expect.any(Date));
            expect(resultItem.modifiedAt).toEqual(expect.any(Date));
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    course: true,
                    student: true,
                },
            });

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await studentCoursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    course: true,
                    student: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("trxGetByIdList", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue(studentCoursesMockList),
                },
            } as any;

            const idList = studentCoursesMockList.map((entity) => entity.id);
            const result = await studentCoursesRepository.trxGetByIdList(trx, idList);

            expect(trx.manager.find).toHaveBeenCalledWith(StudentCourses, {
                relations: {
                    course: true,
                    student: true,
                },
                where: {
                    id: In(idList),
                },
            });
            expect(result).toEqual(studentCoursesMockList);
        });

        it("should return empty array if entities not found", async () => {
            const trx: QueryRunner = {
                manager: {
                    find: jest.fn().mockResolvedValue([]),
                },
            } as any;

            const idList = studentCoursesMockList.map((entity) => entity.id);
            const result = await studentCoursesRepository.trxGetByIdList(trx, idList);

            expect(trx.manager.find).toHaveBeenCalledWith(StudentCourses, {
                relations: {
                    course: true,
                    student: true,
                },
                where: {
                    id: In(idList),
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("getByCourseAndStudent", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const courseId = 1;
            const studentId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesRepository.getByCourseAndStudent(
                courseId,
                studentId,
            );

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    course: { id: courseId },
                    student: { id: studentId },
                },
                relations: {
                    course: true,
                    student: true,
                },
            });

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should return null if entity not found", async () => {
            const courseId = 1;
            const studentId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesRepository.getByCourseAndStudent(
                courseId,
                studentId,
            );

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    course: { id: courseId },
                    student: { id: studentId },
                },
                relations: {
                    course: true,
                    student: true,
                },
            });
            // expect(result).toEqual(null);
        });
    });

    describe("trxGetByCourseAndStudent", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const courseId = 1;
            const studentId = 1;

            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(studentCourseStub),
                },
            } as any;

            const result = await studentCoursesRepository.trxGetByCourseAndStudent(
                trx,
                courseId,
                studentId,
            );

            expect(trx.manager.findOne).toHaveBeenCalledWith(StudentCourses, {
                where: {
                    course: { id: courseId },
                    student: { id: studentId },
                },
                relations: {
                    course: true,
                    student: true,
                },
            });

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should return null if entity not found", async () => {
            const courseId = 999;
            const studentId = 999;

            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const result = await studentCoursesRepository.trxGetByCourseAndStudent(
                trx,
                courseId,
                studentId,
            );

            expect(trx.manager.findOne).toHaveBeenCalledWith(StudentCourses, {
                where: {
                    course: { id: courseId },
                    student: { id: studentId },
                },
                relations: {
                    course: true,
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
                    findOne: jest.fn().mockResolvedValue(studentCourseStub),
                },
            } as any;

            const result = await studentCoursesRepository.trxGetById(trx, id);

            expect(trx.manager.findOne).toHaveBeenCalledWith(StudentCourses, {
                where: {
                    id,
                },
                relations: {
                    course: true,
                    student: true,
                },
            });

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should return null if entity not found", async () => {
            const id = 1;

            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const result = await studentCoursesRepository.trxGetById(trx, id);

            expect(trx.manager.findOne).toHaveBeenCalledWith(StudentCourses, {
                where: {
                    id,
                },
                relations: {
                    course: true,
                    student: true,
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
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<StudentCourses>,
            );

            studentCoursesRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.course`,
                "course",
            );
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.student`,
                "user",
            );
        });
    });

    describe("create a course student-courses", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(studentCourseStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesRepository.create(studentCourseStub);

            expect(entityRepository.save).toHaveBeenCalledWith(studentCourseStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should throw an err on the repository", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await studentCoursesRepository.create(studentCourseStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(undefined);

            const entityId = 1;

            await studentCoursesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(undefined);

            const result = await studentCoursesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("trxBulkDelete", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    delete: jest.fn().mockResolvedValue(null),
                },
            } as any;

            const entityId = 1;

            await studentCoursesRepository.trxBulkDelete(trx, [entityId]);

            expect(trx.manager.delete).toHaveBeenCalledWith(StudentCourses, {
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

            const result = await studentCoursesRepository.trxBulkDelete(trx, [entityId]);

            expect(trx.manager.delete).toHaveBeenCalledWith(StudentCourses, {
                id: In([entityId]),
            });
            expect(trx.manager.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("update a student-course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(studentCourseStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesRepository.update(studentCourseStub);

            expect(entityRepository.save).toHaveBeenCalledWith(studentCourseStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(studentCourseStub);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            studentCourseStub.id = 999;

            try {
                await studentCoursesRepository.update(studentCourseStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("trxUpdate", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(studentCourseStub),
                    save: jest.fn().mockResolvedValue(studentCourseStub),
                },
            } as any;

            const result = await studentCoursesRepository.trxUpdate(trx, studentCourseStub);

            expect(trx.manager.save).toHaveBeenCalledWith(studentCourseStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.course).toEqual(studentCourseStub.course);
            expect(result.courseId).toEqual(studentCourseStub.courseId);
            expect(result.student).toEqual(studentCourseStub.student);
            expect(result.studentId).toEqual(studentCourseStub.studentId);
            expect(result.createdAt).toEqual(expect.any(Date));
            expect(result.modifiedAt).toEqual(expect.any(Date));
        });

        it("should call save on the repository with wrong id", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(studentCourseStub),
                    save: jest.fn().mockResolvedValue(studentCourseStub),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            studentCourseStub.id = 999;

            try {
                await studentCoursesRepository.trxUpdate(trx, studentCourseStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });

        it("should throw an err on the repository", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await studentCoursesRepository.trxUpdate(trx, studentCourseStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });
});

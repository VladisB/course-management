import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { lessonMockList, lessonStub } from "@app/common/test/stubs";
import { BaseErrorMessage } from "@app/common/enum";
import { LessonsRepository } from "../lessons.repository";
import { Lesson } from "../entities/lesson.entity";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { mockLessonsRepository } from "./mocks";

const tableName = "lesson";
const queryBuilderMock = mockQueryBuilder<Lesson>(lessonMockList);

describe("LessonsRepository", () => {
    let lessonsRepository: LessonsRepository;

    const entityRepositoryToken = getRepositoryToken(Lesson);
    let entityRepository: Repository<Lesson>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                LessonsRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockLessonsRepository(),
                },
            ],
        }).compile();

        lessonsRepository = moduleRef.get<LessonsRepository>(LessonsRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getByTheme", () => {
        it("should return the lesson if it exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonStub);

            const result = await lessonsRepository.getByTheme(lessonStub.theme);

            expect(result).toEqual(lessonStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    theme: lessonStub.theme,
                },
                relations: {
                    course: true,
                },
            });
        });

        it("should return null if role doesn't exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await lessonsRepository.getByTheme(lessonStub.theme);

            expect(result).toEqual(null);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    theme: lessonStub.theme,
                },
                relations: {
                    course: true,
                },
            });
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonStub);

            const result = await lessonsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: [
                    "course",
                    "course.courseInstructors",
                    "course.courseInstructors.instructor",
                ],
            });
            expect(result).toEqual(lessonStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await lessonsRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: [
                    "course",
                    "course.courseInstructors",
                    "course.courseInstructors.instructor",
                ],
            });
            expect(result).toEqual(null);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                queryBuilderMock as any as SelectQueryBuilder<Lesson>,
            );

            lessonsRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(queryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "lesson.course",
                "course",
            );
        });
    });

    describe("getAllQByStudent", () => {
        it("should call createQueryBuilder on the repository", async () => {
            const studentId = 1;

            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                innerJoinAndMapMany: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Lesson>,
            );

            lessonsRepository.getAllQByStudent(studentId);

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "lesson.course",
                "course",
            );
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "course.studentCourses",
                "studentCourses",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith(
                "studentCourses.studentId = :studentId",
                { studentId },
            );
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
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "lesson.grades",
                "lesson_grades",
                "lesson_grades.student_id = :studentId",
                { studentId },
            );
        });
    });

    describe("getAllQByInstructor", () => {
        it("should call createQueryBuilder on the repository", async () => {
            const instructorId = 1;

            const localQueryBuilderMock = {
                ...queryBuilderMock,
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                innerJoin: jest.fn(() => localQueryBuilderMock),
                where: jest.fn(() => localQueryBuilderMock),
                innerJoinAndMapMany: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Lesson>,
            );

            lessonsRepository.getAllQByInstructor(instructorId);

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.innerJoinAndSelect).toHaveBeenCalledWith(
                "lesson.course",
                "course",
            );
            expect(localQueryBuilderMock.innerJoin).toHaveBeenCalledWith(
                "course.courseInstructors",
                "filteredCourseInstructors",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith(
                "filteredCourseInstructors.instructorId = :instructorId",
                { instructorId },
            );
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
        });
    });

    describe("create a lesson", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(lessonStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonStub);

            const result = await lessonsRepository.create(lessonStub);

            expect(entityRepository.save).toHaveBeenCalledWith(lessonStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                id: expect.any(Number),
                theme: lessonStub.theme,
                course: lessonStub.course,
                date: lessonStub.date,
            });
        });
    });

    describe("update lesson", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(lessonStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(lessonStub);

            const result = await lessonsRepository.update(lessonStub);

            expect(entityRepository.save).toHaveBeenCalledWith(lessonStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(lessonStub);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            lessonStub.id = 999;

            try {
                await lessonsRepository.update(lessonStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const entityId = 1;

            await lessonsRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await lessonsRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

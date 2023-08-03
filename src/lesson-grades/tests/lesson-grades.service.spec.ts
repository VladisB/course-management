import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import {
    lessonGradeVMMockList,
    lessonGradesMockList,
    lessonGradesStub,
    lessonMockList,
    lessonStub,
    lessonStubCS,
    studentCoursesLGStub,
    studentLGStub,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { LessonGrades } from "../entities/lesson-grade.entity";
import { LessonGradesViewModelFactory } from "../model-factories";
import { LessonGradesService } from "../lesson-grades.service";
import { ILessonGradesRepository } from "../lesson-grades.repository";
import {
    mockLessonGradesRepository,
    mockLessonsRepository,
    mockStudentCoursesRepository,
    mockUsersRepository,
} from "./mocks";
import { ILessonsRepository } from "@app/lessons/lessons.repository";
import { CreateLessonGradeDto } from "../dto/create-lesson-grade.dto";
import { IUsersRepository } from "@app/users/users.repository";
import { IStudentCoursesRepository } from "@app/student-courses/student-courses.repository";
import e from "express";
import { UpdateLessonGradeDto } from "../dto/update-lesson-grade.dto";

const queryBuilderMock = mockQueryBuilder<LessonGrades>(lessonMockList);

describe("LessonGradesService", () => {
    let lessonGradesService: LessonGradesService;
    let lessonRepository: ILessonsRepository;
    let userRepository: IUsersRepository;
    let lessonGradesRepository: ILessonGradesRepository;
    let lessonGradesViewModelFactory: LessonGradesViewModelFactory;
    let studentCoursesRepository: IStudentCoursesRepository;
    let queryBuilder: Partial<SelectQueryBuilder<LessonGrades>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LessonGradesService,
                {
                    provide: ILessonGradesRepository,
                    useValue: mockLessonGradesRepository(),
                },
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: ILessonsRepository,
                    useValue: mockLessonsRepository(),
                },
                {
                    provide: IStudentCoursesRepository,
                    useValue: mockStudentCoursesRepository(),
                },
                { provide: LessonGradesViewModelFactory, useClass: LessonGradesViewModelFactory },
            ],
        }).compile();

        lessonGradesService = module.get<LessonGradesService>(LessonGradesService);
        lessonGradesRepository = module.get(ILessonGradesRepository);
        lessonRepository = module.get(ILessonsRepository);
        userRepository = module.get(IUsersRepository);
        studentCoursesRepository = module.get(IStudentCoursesRepository);
        lessonGradesViewModelFactory = module.get(LessonGradesViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("LessonGradessService should be defined", () => {
        expect(lessonGradesService).toBeDefined();
    });

    it("lessonGradesRepository should be defined", () => {
        expect(lessonGradesRepository).toBeDefined();
    });

    it("lessonRepository should be defined", () => {
        expect(lessonRepository).toBeDefined();
    });

    it("lessonViewModelFactory should be defined", () => {
        expect(lessonGradesViewModelFactory).toBeDefined();
    });

    describe("create a grade", () => {
        it("should save a grade", async () => {
            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };
            jest.spyOn(lessonGradesRepository, "getByLesson").mockResolvedValue(null);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxCreate").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );
            jest.spyOn(lessonRepository, "trxGetAllByCourseId").mockResolvedValue(lessonMockList);

            const result = await lessonGradesService.createGrade(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                grade: expect.any(Number),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
            });
        });

        it("should throw an error if lesson grade already exists", async () => {
            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            jest.spyOn(lessonGradesRepository, "getByLesson").mockResolvedValue(lessonGradesStub);

            await expect(lessonGradesService.createGrade(dto, user)).rejects.toThrowError(
                new ConflictException("Grade for this lesson and student already exists"),
            );
        });

        it("should throw an error if lesson doesn't exists", async () => {
            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            await expect(lessonGradesService.createGrade(dto, user)).rejects.toThrowError(
                new BadRequestException("Provided lesson not found"),
            );
        });

        it("should throw an error if student doesn't exists", async () => {
            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);

            await expect(lessonGradesService.createGrade(dto, user)).rejects.toThrowError(
                new BadRequestException("Provided student not found"),
            );
        });

        it("should call rollback if throw an error ", async () => {
            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            jest.spyOn(lessonGradesRepository, "getByLesson").mockResolvedValue(null);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxCreate").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );
            jest.spyOn(lessonRepository, "trxGetAllByCourseId").mockResolvedValue(null);
            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await lessonGradesService.createGrade(dto, user);

                expect(lessonGradesService.createGrade).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(lessonGradesRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });
    });

    describe("get lesson grade by id", () => {
        it("should return lesson grade", async () => {
            const repoSpy = jest
                .spyOn(lessonGradesRepository, "getById")
                .mockResolvedValue(lessonGradesStub);
            const id = 1;

            expect(await lessonGradesService.getGrade(id)).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                grade: expect.any(Number),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if lesson grade does not exist", async () => {
            const id = 99;
            expect(lessonGradesService.getGrade(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonGradesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete lesson grade by id", () => {
        it("should delete lesson grade", async () => {
            const repoSpy = jest
                .spyOn(lessonGradesRepository, "getById")
                .mockResolvedValue(lessonGradesStub);

            jest.spyOn(lessonGradesRepository, "trxDeleteById").mockResolvedValue(null);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );
            jest.spyOn(lessonRepository, "trxGetAllByCourseId").mockResolvedValue(lessonMockList);

            const id = 1;

            const result = await lessonGradesService.deleteGrade(id);

            expect(result).toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should call rollback ir thown an error", async () => {
            const repoSpy = jest
                .spyOn(lessonGradesRepository, "getById")
                .mockResolvedValue(lessonGradesStub);

            jest.spyOn(lessonGradesRepository, "trxDeleteById").mockResolvedValue(null);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );
            jest.spyOn(console, "error").mockImplementation((err) => err);

            const id = 1;

            try {
                const result = await lessonGradesService.deleteGrade(id);

                expect(result).toBeUndefined();
                expect(repoSpy).toBeCalledWith(id);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(lessonGradesRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });

        it("should throw NotFoundException if lesson grade to delete does not exist", async () => {
            const id = 99;

            await expect(lessonGradesService.deleteGrade(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonGradesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all lesson grades from the repository", () => {
        it("should return a list of lesson grades", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonGradesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<LessonGrades>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                lessonGradesMockList,
                lessonGradesMockList.length,
            ]);
            jest.spyOn(
                lessonGradesViewModelFactory,
                "initLessonGradeListViewModel",
            ).mockReturnValue(lessonGradeVMMockList);

            const result = await lessonGradesService.getAllGrades(queryParams);

            expect(result.totalRecords).toEqual(lessonGradesMockList.length);
        });

        it("should return a empty list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonGradesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<LessonGrades>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(
                lessonGradesViewModelFactory,
                "initLessonGradeListViewModel",
            ).mockReturnValue([]);

            const result = await lessonGradesService.getAllGrades(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update lesson grade", () => {
        it("should return an updated lesson grade", async () => {
            const id = 1;

            const dto: UpdateLessonGradeDto = {
                grade: 90,
                lessonId: 1,
                studentId: 1,
            };

            jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxUpdate").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );
            jest.spyOn(lessonRepository, "trxGetAllByCourseId").mockResolvedValue(lessonMockList);

            const result = await lessonGradesService.updateGrade(id, dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                grade: expect.any(Number),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
            });
        });

        it("should call rollback if thrown an error", async () => {
            const id = 1;

            const dto: UpdateLessonGradeDto = {
                grade: 90,
                lessonId: 1,
                studentId: 1,
            };

            jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);
            jest.spyOn(lessonGradesRepository, "trxUpdate").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonGradesRepository, "trxGetAllByCourse").mockResolvedValue(
                lessonGradesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxGetByCourseAndStudent").mockResolvedValue(
                studentCoursesLGStub,
            );

            try {
                const result = await lessonGradesService.updateGrade(id, dto, user);

                expect(result).toEqual({
                    id: expect.any(Number),
                    studentId: expect.any(Number),
                    studentName: expect.any(String),
                    studentLastName: expect.any(String),
                    grade: expect.any(Number),
                    createdBy: expect.any(String),
                    modifiedBy: expect.any(String),
                    createdAt: expect.any(Date),
                });
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(lessonGradesRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });

        it("should throw an error if lesson doesn't exists", async () => {
            const id = 1;

            const dto: UpdateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };
            jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(lessonGradesStub);

            await expect(lessonGradesService.updateGrade(id, dto, user)).rejects.toThrowError(
                new BadRequestException("Provided lesson not found"),
            );
        });

        it("should throw an error if provided student is not assigned to the lessons course", async () => {
            const id = 1;

            const dto: UpdateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStubCS);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);

            await expect(lessonGradesService.updateGrade(id, dto, user)).rejects.toThrowError(
                new BadRequestException("Provided student is not assigned to the lessons course"),
            );
        });

        it("should throw an error if student doesn't exists", async () => {
            const id = 1;

            const dto: CreateLessonGradeDto = {
                lessonId: 1,
                studentId: 1,
                grade: 100,
            };

            jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(lessonGradesStub);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);

            await expect(lessonGradesService.updateGrade(id, dto, user)).rejects.toThrowError(
                new BadRequestException("Provided student not found"),
            );
        });

        it("should throw NotFoundException since updated lesson grade not found", async () => {
            const dto: UpdateLessonGradeDto = {
                grade: 90,
            };

            const id = 99;

            expect(lessonGradesService.updateGrade(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonGradesRepository.getById).toHaveBeenCalledWith(id);
        });
    });
});

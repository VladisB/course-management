import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import {
    courseMockList,
    courseStub,
    lessonMockList,
    lessonStub,
    lessonVMMockList,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { mockCoursesRepository, mockLessonsRepository } from "./mocks";
import { LessonsService } from "../lessons.service";
import { ILessonsRepository } from "../lessons.repository";
import { LessonViewModelFactory } from "../model-factories/lessons.vm-factory";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { Lesson } from "../entities/lesson.entity";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { UpdateLessonDto } from "../dto/update-lesson.dto";

const queryBuilderMock = mockQueryBuilder<Lesson>(lessonMockList);
const queryBuilderMockEmpty = mockQueryBuilder<Lesson>(lessonMockList);

describe("LessonsService", () => {
    let lessonsService: LessonsService;
    let coursesRepository: ICoursesRepository;
    let lessonsRepository: ILessonsRepository;
    let lessonViewModelFactory: LessonViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<Lesson>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LessonsService,
                {
                    provide: ILessonsRepository,
                    useValue: mockLessonsRepository(),
                },
                {
                    provide: ICoursesRepository,
                    useValue: mockCoursesRepository(),
                },
                { provide: LessonViewModelFactory, useClass: LessonViewModelFactory },
            ],
        }).compile();

        lessonsService = module.get<LessonsService>(LessonsService);
        lessonsRepository = module.get(ILessonsRepository);
        coursesRepository = module.get(ICoursesRepository);
        lessonViewModelFactory = module.get(LessonViewModelFactory);
        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("LessonsService should be defined", () => {
        expect(lessonsService).toBeDefined();
    });

    it("lessonsRepository should be defined", () => {
        expect(lessonsRepository).toBeDefined();
    });

    it("lessonViewModelFactory should be defined", () => {
        expect(lessonViewModelFactory).toBeDefined();
    });

    describe("create a lesson", () => {
        it("should save the new lesson", async () => {
            const dto: CreateLessonDto = {
                theme: "test",
                date: new Date(),
                courseId: 1,
            };

            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(lessonsRepository, "trxCreate").mockResolvedValue(lessonStub);
            jest.spyOn(lessonsRepository, "trxGetAllByCourseId").mockResolvedValue([lessonStub]);

            const result = await lessonsService.createLesson(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                courseId: expect.any(Number),
                course: courseStub.name,
                date: expect.any(Date),
                instructorList: expect.any(Array),
                theme: expect.any(String),
            });
        });

        it("should throw an error if lesson already exists", async () => {
            const dto: CreateLessonDto = {
                theme: "test",
                date: new Date(),
                courseId: 1,
            };

            jest.spyOn(lessonsRepository, "getByTheme").mockResolvedValue(lessonStub);

            await expect(lessonsService.createLesson(dto, user)).rejects.toThrowError(
                new ConflictException("Lesson with this theme already exists"),
            );
        });

        it("should throw an error if course doesn't exists", async () => {
            const dto: CreateLessonDto = {
                theme: "test",
                date: new Date(),
                courseId: 1,
            };

            await expect(lessonsService.createLesson(dto, user)).rejects.toThrowError(
                new BadRequestException("Provided course does not exist"),
            );
        });
    });

    describe("get lesson by id", () => {
        it("should return lesson", async () => {
            const repoSpy = jest.spyOn(lessonsRepository, "getById").mockResolvedValue(lessonStub);
            const lessonId = 1;

            expect(await lessonsService.getLesson(lessonId)).toEqual({
                id: expect.any(Number),
                courseId: expect.any(Number),
                course: courseStub.name,
                date: expect.any(Date),
                instructorList: expect.any(Array),
                theme: lessonStub.theme,
            });
            expect(repoSpy).toBeCalledWith(lessonId);
        });

        it("should throw NotFoundException if lesson does not exist", async () => {
            const lessonId = 99;
            expect(lessonsService.getLesson(lessonId)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonsRepository.getById).toHaveBeenCalledWith(lessonId);
        });
    });

    describe("delete lesson by id", () => {
        it("should delete lesson", async () => {
            const repoSpy = jest.spyOn(lessonsRepository, "getById").mockResolvedValue(lessonStub);
            const id = 1;

            expect(lessonsService.deleteLesson(id)).resolves.toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if lesson to delete does not exist", async () => {
            const id = 99;

            await expect(lessonsService.deleteLesson(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonsRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all lessons from the repository", () => {
        it("should return a list of lessons", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Lesson>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                lessonMockList,
                lessonMockList.length,
            ]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue(
                lessonVMMockList,
            );

            const result = await lessonsService.getLessons(queryParams);

            const resultThemes = result.records.map((item) => item.theme);
            const mockThemes = lessonMockList.map((role) => role.theme);

            expect(result.totalRecords).toEqual(lessonMockList.length);
            expect(resultThemes).toEqual(mockThemes);
        });

        it("should return a empty list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Lesson>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue([]);

            const result = await lessonsService.getLessons(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("get all Student lessons from the repository", () => {
        it("should return a list of Student lessons", async () => {
            const queryParams: QueryParamsDTO = {};
            const studentId = 2;

            jest.spyOn(lessonsRepository, "getAllQByStudent").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Lesson>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                lessonMockList,
                lessonMockList.length,
            ]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue(
                lessonVMMockList,
            );

            const result = await lessonsService.getStudentLessons(queryParams, studentId);

            const resultThemes = result.records.map((item) => item.theme);
            const mockThemes = lessonMockList.map((role) => role.theme);

            expect(result.totalRecords).toEqual(lessonMockList.length);
            expect(resultThemes).toEqual(mockThemes);
            expect(lessonsRepository.getAllQByStudent).toHaveBeenCalledWith(studentId);
        });

        it("should return a empty list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonsRepository, "getAllQByStudent").mockReturnValue(
                queryBuilderMockEmpty as unknown as SelectQueryBuilder<Lesson>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue([]);

            const result = await lessonsService.getLessons(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("get all Instructor lessons from the repository", () => {
        it("should return a list of Instructor lessons", async () => {
            const queryParams: QueryParamsDTO = {};
            const studentId = 2;

            jest.spyOn(lessonsRepository, "getAllQByInstructor").mockReturnValue(
                queryBuilderMockEmpty as unknown as SelectQueryBuilder<Lesson>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                lessonMockList,
                lessonMockList.length,
            ]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue(
                lessonVMMockList,
            );

            const result = await lessonsService.getInstructorLessons(queryParams, studentId);

            const resultThemes = result.records.map((item) => item.theme);
            const mockThemes = lessonMockList.map((role) => role.theme);

            expect(result.totalRecords).toEqual(lessonMockList.length);
            expect(resultThemes).toEqual(mockThemes);
            expect(lessonsRepository.getAllQByInstructor).toHaveBeenCalledWith(studentId);
        });

        it("should return a empty list of lessons", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(lessonsRepository, "getAllQByStudent").mockReturnValue(
                queryBuilderMockEmpty as unknown as SelectQueryBuilder<Lesson>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(lessonViewModelFactory, "initLessonListViewModel").mockReturnValue([]);

            const result = await lessonsService.getLessons(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update lesson", () => {
        it("should return an updated lesson", async () => {
            const courseId = 1;
            const lessonId = 1;

            const dto: UpdateLessonDto = {
                theme: "updated theme",
                date: new Date(),
                courseId,
            };

            jest.spyOn(lessonsRepository, "getById").mockResolvedValue(
                lessonMockList.find((r) => r.id === lessonId),
            );
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(
                courseMockList.find((r) => r.id === courseId),
            );

            const result = await lessonsService.updateLesson(lessonId, dto, user);

            expect(result).toEqual({
                id: lessonId,
                courseId: courseId,
                theme: dto.theme,
                course: courseMockList.find((r) => r.id === courseId).name,
                date: expect.any(Date),
                instructorList: expect.any(Array),
            });
        });

        it("should throw Error if provided course doesn't exist", async () => {
            const courseId = 999;

            const dto: UpdateLessonDto = {
                theme: "updated theme",
                date: new Date(),
                courseId,
            };

            const lessonId = 1;

            jest.spyOn(lessonsRepository, "getById").mockResolvedValue(
                lessonMockList.find((r) => r.id === lessonId),
            );

            await expect(lessonsService.updateLesson(lessonId, dto, user)).rejects.toThrow(
                new BadRequestException("Provided course does not exist"),
            );

            expect(coursesRepository.getById).toHaveBeenCalledWith(courseId);
        });

        it("should throw Error if provided theme is not unique", async () => {
            const courseId = 1;

            const dto: UpdateLessonDto = {
                theme: "Test theme",
                date: new Date(),
                courseId,
            };

            const lessonId = 1;

            jest.spyOn(lessonsRepository, "getById").mockResolvedValue(
                lessonMockList.find((r) => r.id === lessonId),
            );

            jest.spyOn(coursesRepository, "getById").mockResolvedValue(
                courseMockList.find((r) => r.id === courseId),
            );

            const lesson = lessonMockList.find((r) => r.theme === dto.theme);

            jest.spyOn(lessonsRepository, "getByTheme").mockResolvedValue(lesson);

            await expect(lessonsService.updateLesson(lessonId, dto, user)).rejects.toThrow(
                new ConflictException("Lesson with this theme already exists"),
            );

            expect(lessonsRepository.getByTheme).toHaveBeenCalledWith(dto.theme);
            expect(lessonsRepository.getById).toHaveBeenCalledWith(lessonId);
        });

        it("should throw NotFoundException since updated lesson not found", async () => {
            const dto: UpdateLessonDto = {
                theme: "updated theme",
                date: new Date(),
                courseId: 1,
            };

            const lessonId = 99;

            expect(lessonsService.updateLesson(lessonId, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(lessonsRepository.getById).toHaveBeenCalledWith(lessonId);
        });
    });
});

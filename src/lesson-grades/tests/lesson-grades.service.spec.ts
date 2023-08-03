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
    lessonGradesMockList,
    lessonGradesStub,
    lessonMockList,
    lessonStub,
    lessonVMMockList,
    studentCoursesLGStub,
    studentLGStub,
    studentUserStub,
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

const queryBuilderMock = mockQueryBuilder<LessonGrades>(lessonMockList);
const queryBuilderMockEmpty = mockQueryBuilder<LessonGrades>(lessonMockList);

describe("LessonGradesService", () => {
    let lessonGradesService: LessonGradesService;
    let lessonRepository: ILessonsRepository;
    let userRepository: IUsersRepository;
    let lessonGradesRepository: ILessonGradesRepository;
    let lessonViewModelFactory: LessonGradesViewModelFactory;
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
        lessonViewModelFactory = module.get(LessonGradesViewModelFactory);

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
        expect(lessonViewModelFactory).toBeDefined();
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
        //     // it("should throw an error if lesson already exists", async () => {
        //     //     const dto: CreateLessonGradesDto = {
        //     //         theme: "test",
        //     //         date: new Date(),
        //     //         courseId: 1,
        //     //     };
        //     //     jest.spyOn(lessonGradesRepository, "getByTheme").mockResolvedValue(lessonStub);
        //     //     await expect(lessonGradesService.createLessonGrades(dto, user)).rejects.toThrowError(
        //     //         new ConflictException("LessonGrades with this theme already exists"),
        //     //     );
        //     // });
        //     // it("should throw an error if course doesn't exists", async () => {
        //     //     const dto: CreateLessonGradesDto = {
        //     //         theme: "test",
        //     //         date: new Date(),
        //     //         courseId: 1,
        //     //     };
        //     //     await expect(lessonGradesService.createLessonGrades(dto, user)).rejects.toThrowError(
        //     //         new BadRequestException("Provided course does not exist"),
        //     //     );
        //     // });
    });

    // describe("get lesson by id", () => {
    //     it("should return lesson", async () => {
    //         const repoSpy = jest
    //             .spyOn(lessonGradesRepository, "getById")
    //             .mockResolvedValue(lessonStub);
    //         const lessonId = 1;

    //         expect(await lessonGradesService.getLessonGrades(lessonId)).toEqual({
    //             id: expect.any(Number),
    //             courseId: expect.any(Number),
    //             course: courseStub.name,
    //             date: expect.any(Date),
    //             instructorList: expect.any(Array),
    //             theme: lessonStub.theme,
    //         });
    //         expect(repoSpy).toBeCalledWith(lessonId);
    //     });

    //     it("should throw NotFoundException if lesson does not exist", async () => {
    //         const lessonId = 99;
    //         expect(lessonGradesService.getLessonGrades(lessonId)).rejects.toThrow(
    //             new NotFoundException(BaseErrorMessage.NOT_FOUND),
    //         );
    //         expect(lessonGradesRepository.getById).toHaveBeenCalledWith(lessonId);
    //     });
    // });

    // describe("delete lesson by id", () => {
    //     it("should delete lesson", async () => {
    //         const repoSpy = jest
    //             .spyOn(lessonGradesRepository, "getById")
    //             .mockResolvedValue(lessonStub);
    //         const id = 1;

    //         expect(lessonGradesService.deleteLessonGrades(id)).resolves.toBeUndefined();
    //         expect(repoSpy).toBeCalledWith(id);
    //     });

    //     it("should throw NotFoundException if lesson to delete does not exist", async () => {
    //         const id = 99;

    //         await expect(lessonGradesService.deleteLessonGrades(id)).rejects.toThrow(
    //             new NotFoundException(BaseErrorMessage.NOT_FOUND),
    //         );
    //         expect(lessonGradesRepository.getById).toHaveBeenCalledWith(id);
    //     });
    // });

    // describe("get all lessons from the repository", () => {
    //     it("should return a list of lessons", async () => {
    //         const queryParams: QueryParamsDTO = {};

    //         jest.spyOn(lessonGradesRepository, "getAllQ").mockReturnValue(
    //             queryBuilderMock as unknown as SelectQueryBuilder<LessonGrades>,
    //         );
    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
    //             lessonMockList,
    //             lessonMockList.length,
    //         ]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue(
    //             lessonVMMockList,
    //         );

    //         const result = await lessonGradesService.getLessonGradess(queryParams);

    //         const resultThemes = result.records.map((item) => item.theme);
    //         const mockThemes = lessonMockList.map((role) => role.theme);

    //         expect(result.totalRecords).toEqual(lessonMockList.length);
    //         expect(resultThemes).toEqual(mockThemes);
    //     });

    //     it("should return a empty list of roles", async () => {
    //         const queryParams: QueryParamsDTO = {};

    //         jest.spyOn(lessonGradesRepository, "getAllQ").mockReturnValue(
    //             queryBuilderMock as unknown as SelectQueryBuilder<LessonGrades>,
    //         );

    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue([]);

    //         const result = await lessonGradesService.getLessonGradess(queryParams);

    //         expect(result.totalRecords).toEqual(0);
    //         expect(result.records).toEqual([]);
    //     });
    // });

    // describe("get all Student lessons from the repository", () => {
    //     it("should return a list of Student lessons", async () => {
    //         const queryParams: QueryParamsDTO = {};
    //         const studentId = 2;

    //         jest.spyOn(lessonGradesRepository, "getAllQByStudent").mockReturnValue(
    //             queryBuilderMock as unknown as SelectQueryBuilder<LessonGrades>,
    //         );
    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
    //             lessonMockList,
    //             lessonMockList.length,
    //         ]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue(
    //             lessonVMMockList,
    //         );

    //         const result = await lessonGradesService.getStudentLessonGradess(
    //             queryParams,
    //             studentId,
    //         );

    //         const resultThemes = result.records.map((item) => item.theme);
    //         const mockThemes = lessonMockList.map((role) => role.theme);

    //         expect(result.totalRecords).toEqual(lessonMockList.length);
    //         expect(resultThemes).toEqual(mockThemes);
    //         expect(lessonGradesRepository.getAllQByStudent).toHaveBeenCalledWith(studentId);
    //     });

    //     it("should return a empty list of roles", async () => {
    //         const queryParams: QueryParamsDTO = {};

    //         jest.spyOn(lessonGradesRepository, "getAllQByStudent").mockReturnValue(
    //             queryBuilderMockEmpty as unknown as SelectQueryBuilder<LessonGrades>,
    //         );

    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue([]);

    //         const result = await lessonGradesService.getLessonGradess(queryParams);

    //         expect(result.totalRecords).toEqual(0);
    //         expect(result.records).toEqual([]);
    //     });
    // });

    // describe("get all Instructor lessons from the repository", () => {
    //     it("should return a list of Instructor lessons", async () => {
    //         const queryParams: QueryParamsDTO = {};
    //         const studentId = 2;

    //         jest.spyOn(lessonGradesRepository, "getAllQByInstructor").mockReturnValue(
    //             queryBuilderMockEmpty as unknown as SelectQueryBuilder<LessonGrades>,
    //         );
    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
    //             lessonMockList,
    //             lessonMockList.length,
    //         ]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue(
    //             lessonVMMockList,
    //         );

    //         const result = await lessonGradesService.getInstructorLessonGradess(
    //             queryParams,
    //             studentId,
    //         );

    //         const resultThemes = result.records.map((item) => item.theme);
    //         const mockThemes = lessonMockList.map((role) => role.theme);

    //         expect(result.totalRecords).toEqual(lessonMockList.length);
    //         expect(resultThemes).toEqual(mockThemes);
    //         expect(lessonGradesRepository.getAllQByInstructor).toHaveBeenCalledWith(studentId);
    //     });

    //     it("should return a empty list of lessons", async () => {
    //         const queryParams: QueryParamsDTO = {};

    //         jest.spyOn(lessonGradesRepository, "getAllQByStudent").mockReturnValue(
    //             queryBuilderMockEmpty as unknown as SelectQueryBuilder<LessonGrades>,
    //         );

    //         jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
    //         jest.spyOn(lessonViewModelFactory, "initLessonGradesListViewModel").mockReturnValue([]);

    //         const result = await lessonGradesService.getLessonGradess(queryParams);

    //         expect(result.totalRecords).toEqual(0);
    //         expect(result.records).toEqual([]);
    //     });
    // });

    // describe("update lesson", () => {
    //     it("should return an updated lesson", async () => {
    //         const courseId = 1;
    //         const lessonId = 1;

    //         const dto: UpdateLessonGradesDto = {
    //             theme: "updated theme",
    //             date: new Date(),
    //             courseId,
    //         };

    //         jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(
    //             lessonMockList.find((r) => r.id === lessonId),
    //         );
    //         jest.spyOn(coursesRepository, "getById").mockResolvedValue(
    //             courseMockList.find((r) => r.id === courseId),
    //         );

    //         const result = await lessonGradesService.updateLessonGrades(lessonId, dto, user);

    //         expect(result).toEqual({
    //             id: lessonId,
    //             courseId: courseId,
    //             theme: dto.theme,
    //             course: courseMockList.find((r) => r.id === courseId).name,
    //             date: expect.any(Date),
    //             instructorList: expect.any(Array),
    //         });
    //     });

    //     it("should throw Error if provided course doesn't exist", async () => {
    //         const courseId = 999;

    //         const dto: UpdateLessonGradesDto = {
    //             theme: "updated theme",
    //             date: new Date(),
    //             courseId,
    //         };

    //         const lessonId = 1;

    //         jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(
    //             lessonMockList.find((r) => r.id === lessonId),
    //         );

    //         await expect(
    //             lessonGradesService.updateLessonGrades(lessonId, dto, user),
    //         ).rejects.toThrow(new BadRequestException("Provided course does not exist"));

    //         expect(coursesRepository.getById).toHaveBeenCalledWith(courseId);
    //     });

    //     it("should throw Error if provided theme is not unique", async () => {
    //         const courseId = 1;

    //         const dto: UpdateLessonGradesDto = {
    //             theme: "Test theme",
    //             date: new Date(),
    //             courseId,
    //         };

    //         const lessonId = 1;

    //         jest.spyOn(lessonGradesRepository, "getById").mockResolvedValue(
    //             lessonMockList.find((r) => r.id === lessonId),
    //         );

    //         jest.spyOn(coursesRepository, "getById").mockResolvedValue(
    //             courseMockList.find((r) => r.id === courseId),
    //         );

    //         const lesson = lessonMockList.find((r) => r.theme === dto.theme);

    //         jest.spyOn(lessonGradesRepository, "getByTheme").mockResolvedValue(lesson);

    //         await expect(
    //             lessonGradesService.updateLessonGrades(lessonId, dto, user),
    //         ).rejects.toThrow(new ConflictException("LessonGrades with this theme already exists"));

    //         expect(lessonGradesRepository.getByTheme).toHaveBeenCalledWith(dto.theme);
    //         expect(lessonGradesRepository.getById).toHaveBeenCalledWith(lessonId);
    //     });

    //     it("should throw NotFoundException since updated lesson not found", async () => {
    //         const dto: UpdateLessonGradesDto = {
    //             theme: "updated theme",
    //             date: new Date(),
    //             courseId: 1,
    //         };

    //         const lessonId = 99;

    //         expect(lessonGradesService.updateLessonGrades(lessonId, dto, user)).rejects.toThrow(
    //             new NotFoundException(BaseErrorMessage.NOT_FOUND),
    //         );
    //         expect(lessonGradesRepository.getById).toHaveBeenCalledWith(lessonId);
    //     });
    // });
});

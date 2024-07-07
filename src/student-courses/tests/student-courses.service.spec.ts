import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import {
    courseStub,
    lessonMockList,
    studentCourseStub,
    studentCoursesMockList,
    studentCoursesViewModelMockList,
    studentUserStub,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { IUsersRepository } from "@app/users/users.repository";
import { mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { mockCoursesRepository } from "@app/courses/tests/mocks";
import { IStudentCoursesRepository } from "../student-courses.repository";
import { StudentCoursesViewModel } from "../view-models";
import { StudentCoursesService } from "../student-courses.service";
import { StudentCoursesViewModelFactory } from "../model-factories";
import { mockStudentCoursesRepository } from "./mocks";
import { CreateStudentCoursesDto } from "../dto/create-student-courses.dto";
import { StudentCourses } from "../entities/student-courses.entity";
import { PATCHUpdateStudentCoursesDto } from "../dto/update-student-courses.dto";

const queryBuilderMock = mockQueryBuilder<StudentCoursesViewModel>(lessonMockList);

describe("StudentCoursesService", () => {
    let coursesRepository: ICoursesRepository;
    let studentCoursesService: StudentCoursesService;
    let studentCoursesRepository: IStudentCoursesRepository;
    let studentCoursesViewModelFactory: StudentCoursesViewModelFactory;
    let userRepository: IUsersRepository;

    let queryBuilder: Partial<SelectQueryBuilder<StudentCoursesViewModel>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StudentCoursesService,
                {
                    provide: IStudentCoursesRepository,
                    useValue: mockStudentCoursesRepository(),
                },
                {
                    provide: ICoursesRepository,
                    useValue: mockCoursesRepository(),
                },
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: StudentCoursesViewModelFactory,
                    useClass: StudentCoursesViewModelFactory,
                },
            ],
        }).compile();

        studentCoursesService = module.get<StudentCoursesService>(StudentCoursesService);
        studentCoursesRepository = module.get(IStudentCoursesRepository);
        coursesRepository = module.get(ICoursesRepository);
        userRepository = module.get(IUsersRepository);
        studentCoursesViewModelFactory = module.get(StudentCoursesViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("StudentCoursesViewModelsService should be defined", () => {
        expect(studentCoursesService).toBeDefined();
    });

    it("studentCoursesRepository should be defined", () => {
        expect(studentCoursesRepository).toBeDefined();
    });

    it("coursesRepository should be defined", () => {
        expect(coursesRepository).toBeDefined();
    });

    it("userRepository should be defined", () => {
        expect(userRepository).toBeDefined();
    });

    it("lessonViewModelFactory should be defined", () => {
        expect(studentCoursesViewModelFactory).toBeDefined();
    });

    describe("create a studentCourse", () => {
        it("should save a courseInstructor", async () => {
            const dto: CreateStudentCoursesDto = {
                studentId: 1,
                courseId: 1,
                finalMark: 0,
                feedBack: "",
                passed: false,
            };

            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentUserStub);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(studentCoursesRepository, "getByCourseAndStudent").mockResolvedValue(null);
            jest.spyOn(studentCoursesRepository, "create").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesService.createStudentCourse(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                courseId: expect.any(Number),
                courseName: expect.any(String),
                feedback: expect.any(String || null),
                passed: expect.any(Boolean),
            });
        });

        it("should throw an error if studentCourse do not exists", async () => {
            const dto: CreateStudentCoursesDto = {
                studentId: 1,
                courseId: 1,
                finalMark: 0,
                feedBack: "",
                passed: false,
            };

            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(null);

            await expect(studentCoursesService.createStudentCourse(dto, user)).rejects.toThrowError(
                new BadRequestException(`Student not found.`),
            );
        });

        it("should throw an error if course do not exists", async () => {
            const dto: CreateStudentCoursesDto = {
                studentId: 1,
                courseId: 1,
                finalMark: 0,
                feedBack: "",
                passed: false,
            };

            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentUserStub);

            await expect(studentCoursesService.createStudentCourse(dto, user)).rejects.toThrowError(
                new BadRequestException(`Provided course not found.`),
            );
        });

        it("should throw an error if studentCourse alredy exist(s)", async () => {
            const dto: CreateStudentCoursesDto = {
                studentId: 1,
                courseId: 1,
                finalMark: 0,
                feedBack: "",
                passed: false,
            };

            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentUserStub);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(studentCoursesRepository, "getByCourseAndStudent").mockResolvedValue(
                studentCourseStub,
            );

            await expect(studentCoursesService.createStudentCourse(dto, user)).rejects.toThrowError(
                new ConflictException(`User course already exist.`),
            );
        });
    });

    describe("get studentCourse by id", () => {
        it("should return studentCourse", async () => {
            const repoSpy = jest
                .spyOn(studentCoursesRepository, "getById")
                .mockResolvedValue(studentCourseStub);
            const id = 1;

            expect(await studentCoursesService.getStudentCourse(id)).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                courseId: expect.any(Number),
                courseName: expect.any(String),
                feedback: expect.any(String || null),
                passed: expect.any(Boolean),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if studentCourse does not exist", async () => {
            const id = 99;

            expect(studentCoursesService.getStudentCourse(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(studentCoursesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete studentCourse by id", () => {
        it("should delete studentCourse", async () => {
            jest.spyOn(studentCoursesRepository, "getById").mockResolvedValue(studentCourseStub);

            const id = 1;

            const result = await studentCoursesService.deleteStudentCourse(id);

            expect(result).toBeUndefined();
            expect(studentCoursesRepository.deleteById).toBeCalledWith(id);
        });

        it("should throw NotFoundException if studentCourse to delete does not exist", async () => {
            const id = 99;

            await expect(studentCoursesService.deleteStudentCourse(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(studentCoursesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all studentCourses from the repository", () => {
        it("should return a list of studentCourses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(studentCoursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<StudentCourses>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                studentCoursesMockList,
                studentCoursesMockList.length,
            ]);
            jest.spyOn(
                studentCoursesViewModelFactory,
                "initStudentCoursesListViewModel",
            ).mockReturnValue(studentCoursesViewModelMockList);

            const result = await studentCoursesService.getStudentCourses(queryParams);

            expect(result.totalRecords).toEqual(studentCoursesViewModelMockList.length);
        });

        it("should return a empty list of studentCourses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(studentCoursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<StudentCourses>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(
                studentCoursesViewModelFactory,
                "initStudentCoursesListViewModel",
            ).mockReturnValue([]);

            const result = await studentCoursesService.getStudentCourses(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update studentCourse", () => {
        it("should return an updated studentCourse", async () => {
            const id = 1;
            const dto: PATCHUpdateStudentCoursesDto = {
                finalMark: 0,
                feedBack: "good",
                passed: false,
            };

            jest.spyOn(studentCoursesRepository, "getById").mockResolvedValue(studentCourseStub);
            jest.spyOn(studentCoursesRepository, "update").mockResolvedValue(studentCourseStub);

            const result = await studentCoursesService.updateStudentCourse(id, dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                courseId: expect.any(Number),
                courseName: expect.any(String),
                feedback: expect.any(String),
                passed: expect.any(Boolean),
            });
        });

        it("should throw NotFoundException since updated updateStudentCourse not found", async () => {
            const id = 99;
            const dto: PATCHUpdateStudentCoursesDto = {
                finalMark: 0,
                feedBack: "good",
                passed: false,
            };

            expect(studentCoursesService.updateStudentCourse(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
        });
    });
});

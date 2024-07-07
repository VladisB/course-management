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
    courseStubCS,
    courseVMMockList,
    lessonMockList,
    studentCourseViewModelList,
    studentCoursesMockList,
    studentCoursesViewModelMockList,
    studentUserStub3,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { StudentsViewModelFactory } from "../model-factories";
import { mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import {
    studentMockList,
    studentUserStub,
    studentVMMockList,
} from "@app/common/test/stubs/user.stub";
import { StudentsService } from "../students.service";
import { IUsersRepository } from "@app/users/users.repository";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { mockCoursesRepository } from "@app/courses/tests/mocks";

const queryBuilderMock = mockQueryBuilder<User>(lessonMockList);

describe("StudentsService", () => {
    let studentsService: StudentsService;
    let usersRepository: IUsersRepository;
    let coursesRepository: ICoursesRepository;
    let studentsViewModelFactory: StudentsViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<User>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StudentsService,
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: ICoursesRepository,
                    useValue: mockCoursesRepository(),
                },
                { provide: StudentsViewModelFactory, useClass: StudentsViewModelFactory },
            ],
        }).compile();

        studentsService = module.get<StudentsService>(StudentsService);
        usersRepository = module.get(IUsersRepository);
        coursesRepository = module.get(ICoursesRepository);
        studentsViewModelFactory = module.get(StudentsViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("StudentsService should be defined", () => {
        expect(studentsService).toBeDefined();
    });

    it("usersRepository should be defined", () => {
        expect(usersRepository).toBeDefined();
    });

    it("studentsViewModelFactory should be defined", () => {
        expect(studentsViewModelFactory).toBeDefined();
    });

    describe("get student by id", () => {
        it("should return student", async () => {
            const repoSpy = jest
                .spyOn(usersRepository, "getStudentById")
                .mockResolvedValue(studentUserStub3);
            const id = 1;

            const result = await studentsService.getStudent(id);

            expect(result.id).toEqual(studentUserStub3.id);
            expect(result.email).toEqual(studentUserStub3.email);
            expect(result.firstName).toEqual(studentUserStub3.firstName);
            expect(result.lastName).toEqual(studentUserStub3.lastName);
            expect(result.group).toEqual(studentUserStub3.group);

            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if student does not exist", async () => {
            const id = 99;

            expect(studentsService.getStudent(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(usersRepository.getStudentById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all students from the repository", () => {
        it("should return a list of students", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(usersRepository, "getAllStudentsQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<User>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                studentMockList,
                studentMockList.length,
            ]);
            jest.spyOn(studentsViewModelFactory, "initStudentListViewModel").mockReturnValue(
                studentVMMockList,
            );

            const result = await studentsService.getAllStudents(queryParams);

            const resultStudent = result.records.find((studnet) => studnet.id);
            const mockUser = studentMockList.find((user) => user.id === resultStudent.id);

            expect(result.totalRecords).toEqual(courseVMMockList.length);
            expect(resultStudent.id).toEqual(mockUser.id);
            expect(resultStudent.email).toEqual(mockUser.email);
            expect(resultStudent.firstName).toEqual(mockUser.firstName);
            expect(resultStudent.lastName).toEqual(mockUser.lastName);
            expect(resultStudent.group).toEqual(mockUser.group);
        });

        it("should return a empty list of courses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(usersRepository, "getAllStudentsQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<User>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(studentsViewModelFactory, "initStudentListViewModel").mockReturnValue([]);

            const result = await studentsService.getAllStudents(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("get all get student courses from the repository", () => {
        it("should return a list of student courses", async () => {
            jest.spyOn(usersRepository, "getStudentById").mockResolvedValue(studentUserStub3);
            jest.spyOn(coursesRepository, "getAllByStudentId").mockResolvedValue(courseMockList);

            const studentId = 1;

            const result = await studentsService.getStudentCourses(studentId);

            const courseItem = result.find((course) => course.id);
            const courseMock = courseMockList.find((course) => course.id === courseItem.id);

            expect(result.length).toEqual(courseMockList.length);
            expect(courseItem.id).toEqual(courseMock.id);
            expect(courseItem.name).toEqual(courseMock.name);
        });

        it("should return a empty list of courses", async () => {
            jest.spyOn(usersRepository, "getStudentById").mockResolvedValue(studentUserStub3);
            jest.spyOn(coursesRepository, "getAllByStudentId").mockResolvedValue([]);

            const studentId = 1;

            const result = await studentsService.getStudentCourses(studentId);

            expect(result.length).toEqual(0);
        });
    });
});

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
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { CoursesViewModelFactory } from "../model-factories";
import { Course } from "../entities/course.entity";
import { CoursesService } from "../courses.service";
import { ICoursesRepository } from "../courses.repository";
import { mockCoursesRepository } from "./mocks";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";

const queryBuilderMock = mockQueryBuilder<Course>(lessonMockList);

describe("CoursesService", () => {
    let coursesService: CoursesService;
    let coursesRepository: ICoursesRepository;
    let coursesViewModelFactory: CoursesViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<Course>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CoursesService,
                {
                    provide: ICoursesRepository,
                    useValue: mockCoursesRepository(),
                },
                { provide: CoursesViewModelFactory, useClass: CoursesViewModelFactory },
            ],
        }).compile();

        coursesService = module.get<CoursesService>(CoursesService);
        coursesRepository = module.get(ICoursesRepository);
        coursesViewModelFactory = module.get(CoursesViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("CoursesService should be defined", () => {
        expect(coursesService).toBeDefined();
    });

    it("coursesRepository should be defined", () => {
        expect(coursesRepository).toBeDefined();
    });

    it("lessonViewModelFactory should be defined", () => {
        expect(coursesViewModelFactory).toBeDefined();
    });

    describe("create a course", () => {
        it("should save a course", async () => {
            const dto: CreateCourseDto = {
                name: "test course",
            };

            jest.spyOn(coursesRepository, "getByName").mockResolvedValue(null);

            jest.spyOn(coursesRepository, "create").mockResolvedValue(courseStub);

            const result = await coursesService.createCourse(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                name: dto.name,
                instructorList: expect.any(Array),
            });
        });

        it("should throw an error if course already exists", async () => {
            const dto: CreateCourseDto = {
                name: "test course",
            };

            jest.spyOn(coursesRepository, "getByName").mockResolvedValue(courseStub);

            await expect(coursesService.createCourse(dto, user)).rejects.toThrowError(
                new ConflictException(`Course with name ${dto.name} already exists.`),
            );
        });
    });

    describe("get all courses from the repository", () => {
        it("should return a list of courses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(coursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Course>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                courseMockList,
                courseMockList.length,
            ]);
            jest.spyOn(coursesViewModelFactory, "initCourseListViewModel").mockReturnValue(
                courseVMMockList,
            );

            const result = await coursesService.getCourses(queryParams);

            expect(result.totalRecords).toEqual(courseVMMockList.length);
        });

        it("should return a empty list of courses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(coursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Course>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(coursesViewModelFactory, "initCourseListViewModel").mockReturnValue([]);

            const result = await coursesService.getCourses(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("get course by id", () => {
        it("should return course", async () => {
            const repoSpy = jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            const id = 1;

            expect(await coursesService.getCourse(id)).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                instructorList: expect.any(Array),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if course does not exist", async () => {
            const id = 99;
            expect(coursesService.getCourse(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(coursesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("update a course", () => {
        it("should return updated course", async () => {
            const id = 1;

            const dto: UpdateCourseDto = {
                name: "test course",
            };

            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(coursesRepository, "getByName").mockResolvedValue(courseStub);
            jest.spyOn(coursesRepository, "update").mockResolvedValue(courseStub);

            const result = await coursesService.updateCourse(id, dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                name: dto.name,
                instructorList: expect.any(Array),
            });
        });

        it("should throw an error if course doesn't exists", async () => {
            const id = 1;

            const dto: UpdateCourseDto = {
                name: "test course",
            };

            await expect(coursesService.updateCourse(id, dto, user)).rejects.toThrowError(
                new NotFoundException("The specified resource was not found."),
            );
        });

        it("should throw an error if course whith provided name already exists", async () => {
            const id = 1;

            const dto: UpdateCourseDto = {
                name: courseStub.name,
            };

            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(coursesRepository, "getByName").mockResolvedValue(courseStubCS);

            await expect(coursesService.updateCourse(id, dto, user)).rejects.toThrowError(
                new ConflictException(`Course with name ${dto.name} already exists.`),
            );
        });

        it("should throw NotFoundException since updated course not found", async () => {
            const dto: UpdateCourseDto = {
                name: "test",
            };

            const id = 99;

            expect(coursesService.updateCourse(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(coursesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    // describe("delete course by id", () => {
    //     it("should delete course", async () => {
    //         const repoSpy = jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
    //         const id = 1;

    //         const result = await coursesService.deleteCourse(id);

    //         expect(result).toBeUndefined();
    //         expect(repoSpy).toBeCalledWith(id);
    //     });

    //     it("should throw NotFoundException if course to delete does not exist", async () => {
    //         const id = 99;

    //         await expect(coursesService.deleteCourse(id)).rejects.toThrow(
    //             new NotFoundException(BaseErrorMessage.NOT_FOUND),
    //         );
    //         expect(coursesRepository.getById).toHaveBeenCalledWith(id);
    //     });
    // });

    describe("get all courses from the repository", () => {
        it("should return a list of courses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(coursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Course>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                courseMockList,
                courseMockList.length,
            ]);
            jest.spyOn(coursesViewModelFactory, "initCourseListViewModel").mockReturnValue(
                courseVMMockList,
            );

            const result = await coursesService.getCourses(queryParams);

            expect(result.totalRecords).toEqual(courseVMMockList.length);
        });

        it("should return a empty list of courses", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(coursesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Course>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(coursesViewModelFactory, "initCourseListViewModel").mockReturnValue([]);

            const result = await coursesService.getCourses(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });
});

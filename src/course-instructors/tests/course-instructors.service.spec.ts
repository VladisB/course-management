import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import {
    courseInstructorsListVMMockList,
    courseInstructorsMockList,
    courseInstructorsStub,
    courseStub,
    instructorRoleStub,
    instructorUserStub,
    lessonMockList,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { CourseInstructorsViewModelFactory } from "../model-factories";
import { IUsersRepository } from "@app/users/users.repository";
import { mockCourseInstructorsRepository } from "./mocks";
import { mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { IRolesRepository } from "@app/roles/roles.repository";
import { mockRolesRepository } from "@app/roles/tests/mocks";
import { ICourseInstructorsRepository } from "../course-instructors.repository";
import { CourseInstructorsService } from "../course-instructors.service";
import { CreateCourseInstructorsDto } from "../dto/create-course-instructors.dto";
import { PUTUpdateCourseInstructorsDto } from "../dto/put-update-course-instructors.dto";
import { CourseInstructors } from "../entities/course-instructors.entity";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { mockCoursesRepository } from "@app/courses/tests/mocks";

const queryBuilderMock = mockQueryBuilder<CourseInstructors>(lessonMockList);

describe("CourseInstructorsService", () => {
    let courseInstructorsService: CourseInstructorsService;
    let coursesRepository: ICoursesRepository;
    let userRepository: IUsersRepository;
    let rolesRepository: IRolesRepository;
    let courseInstructorsRepository: ICourseInstructorsRepository;
    let courseInstructorsViewModelFactory: CourseInstructorsViewModelFactory;

    let queryBuilder: Partial<SelectQueryBuilder<CourseInstructors>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CourseInstructorsService,
                {
                    provide: ICourseInstructorsRepository,
                    useValue: mockCourseInstructorsRepository(),
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
                    provide: IRolesRepository,
                    useValue: mockRolesRepository(),
                },
                {
                    provide: CourseInstructorsViewModelFactory,
                    useClass: CourseInstructorsViewModelFactory,
                },
            ],
        }).compile();

        courseInstructorsService = module.get<CourseInstructorsService>(CourseInstructorsService);
        courseInstructorsRepository = module.get(ICourseInstructorsRepository);
        coursesRepository = module.get(ICoursesRepository);
        userRepository = module.get(IUsersRepository);
        rolesRepository = module.get(IRolesRepository);
        courseInstructorsViewModelFactory = module.get(CourseInstructorsViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("CourseInstructorssService should be defined", () => {
        expect(courseInstructorsService).toBeDefined();
    });

    it("courseInstructorsRepository should be defined", () => {
        expect(courseInstructorsRepository).toBeDefined();
    });

    it("lessonViewModelFactory should be defined", () => {
        expect(courseInstructorsViewModelFactory).toBeDefined();
    });

    describe("create a courseInstructor", () => {
        it("should save a courseInstructor", async () => {
            const dto: CreateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(courseInstructorsRepository, "getByDetails").mockResolvedValue(
                courseInstructorsMockList,
            );
            jest.spyOn(courseInstructorsRepository, "bulkCreate").mockResolvedValue(
                courseInstructorsMockList,
            );

            const result = await courseInstructorsService.createCourseInstructors(dto, user);

            expect(result).toEqual({
                courseId: expect.any(Number),
                courseName: expect.any(String),
                instructors: expect.any(Array),
            });
        });

        it("should throw an error if instructors do not exists", async () => {
            const dto: CreateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([]);

            await expect(
                courseInstructorsService.createCourseInstructors(dto, user),
            ).rejects.toThrowError(new BadRequestException(`Some of the instructors not found.`));
        });

        it("should throw an error if course do not exists", async () => {
            const dto: CreateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);

            await expect(
                courseInstructorsService.createCourseInstructors(dto, user),
            ).rejects.toThrowError(new BadRequestException(`Provided course not found.`));
        });

        it("should throw an error if course instructor(s) alredy exist(s)", async () => {
            const dto: CreateCourseInstructorsDto = {
                instructorIdList: [3],
                courseId: 1,
            };

            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(courseInstructorsRepository, "getByDetails").mockResolvedValue(
                courseInstructorsMockList,
            );

            await expect(
                courseInstructorsService.createCourseInstructors(dto, user),
            ).rejects.toThrowError(
                new ConflictException(
                    `Instructor ${courseInstructorsMockList[0].instructor.lastName} is already assigned.`,
                ),
            );
        });
    });

    describe("get getCourseInstructor by id", () => {
        it("should return getCourseInstructor", async () => {
            const repoSpy = jest
                .spyOn(courseInstructorsRepository, "getById")
                .mockResolvedValue(courseInstructorsStub);
            const id = 1;

            expect(await courseInstructorsService.getCourseInstructor(id)).toEqual({
                id: expect.any(Number),
                courseId: expect.any(Number),
                courseName: expect.any(String),
                instructorId: expect.any(Number),
                instructorName: expect.any(String),
                instructorLastName: expect.any(String),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if getCourseInstructor does not exist", async () => {
            const id = 99;

            expect(courseInstructorsService.getCourseInstructor(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(courseInstructorsRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete courseInstructor by id", () => {
        it("should delete courseInstructor", async () => {
            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(coursesRepository, "isAssignedToGroup").mockResolvedValue(false);

            const id = 1;

            const result = await courseInstructorsService.deleteCourseInstructors(id);

            expect(result).toBeUndefined();
            expect(courseInstructorsRepository.deleteById).toBeCalledWith(id);
        });

        it("should throw NotFoundException if courseInstructor to delete does not exist", async () => {
            const id = 99;

            await expect(courseInstructorsService.deleteCourseInstructors(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(courseInstructorsRepository.getByIdWithFullDetails).toHaveBeenCalledWith(id);
        });

        it("should throw ConflictException if course have less 1 instructor", async () => {
            const id = 1;
            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(coursesRepository, "isAssignedToGroup").mockResolvedValue(true);

            await expect(courseInstructorsService.deleteCourseInstructors(id)).rejects.toThrow(
                new ConflictException(`Assigned course should have at least one instructor.`),
            );
        });
    });

    describe("get all courseInstructors from the repository", () => {
        it("should return a list of courseInstructors", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(courseInstructorsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<CourseInstructors>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                courseInstructorsMockList,
                courseInstructorsMockList.length,
            ]);
            jest.spyOn(
                courseInstructorsViewModelFactory,
                "initCourseInstructorsListViewModel",
            ).mockReturnValue(courseInstructorsListVMMockList);

            const result = await courseInstructorsService.getCourseInstructors(queryParams);

            expect(result.totalRecords).toEqual(courseInstructorsListVMMockList.length);
        });

        it("should return a empty list of courseInstructors", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(courseInstructorsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<CourseInstructors>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(
                courseInstructorsViewModelFactory,
                "initCourseInstructorsListViewModel",
            ).mockReturnValue([]);

            const result = await courseInstructorsService.getCourseInstructors(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update lesson grade", () => {
        it("should return an updated lesson grade", async () => {
            const id = 1;
            const dto: PUTUpdateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(courseInstructorsRepository, "getByDetails").mockResolvedValue(
                courseInstructorsMockList,
            );
            jest.spyOn(courseInstructorsRepository, "trxGetAllByCourseId").mockResolvedValue(
                courseInstructorsMockList,
            );
            jest.spyOn(courseInstructorsRepository, "trxBulkCreate").mockResolvedValue(
                courseInstructorsMockList,
            );

            const result = await courseInstructorsService.updateCourseInstructors(id, dto, user);

            expect(result).toEqual({
                courseId: expect.any(Number),
                courseName: expect.any(String),
                instructors: expect.any(Array),
            });
        });

        it("should call rollback if thrown an error", async () => {
            const id = 1;
            const dto: PUTUpdateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);
            jest.spyOn(coursesRepository, "getById").mockResolvedValue(courseStub);
            jest.spyOn(courseInstructorsRepository, "getByDetails").mockResolvedValue(
                courseInstructorsMockList,
            );
            jest.spyOn(console, "error").mockImplementation((err) => err);
            jest.spyOn(courseInstructorsRepository, "trxGetAllByCourseId").mockImplementation(
                async () => {
                    throw new Error("Test error");
                },
            );

            try {
                const result = await courseInstructorsService.updateCourseInstructors(
                    id,
                    dto,
                    user,
                );

                expect(result).toBeUndefined();
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(courseInstructorsRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });

        it("should throw an error if course not found", async () => {
            const id = 1;

            const dto: PUTUpdateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([instructorUserStub]);

            await expect(
                courseInstructorsService.updateCourseInstructors(id, dto, user),
            ).rejects.toThrowError(new BadRequestException(`Provided course not found.`));
        });

        it("should throw an error if instructors not found", async () => {
            const id = 1;

            const dto: PUTUpdateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            jest.spyOn(courseInstructorsRepository, "getByIdWithFullDetails").mockResolvedValue(
                courseInstructorsStub,
            );
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(instructorRoleStub);
            jest.spyOn(userRepository, "getByIdList").mockResolvedValue([]);

            await expect(
                courseInstructorsService.updateCourseInstructors(id, dto, user),
            ).rejects.toThrowError(new BadRequestException(`Some of the instructors not found.`));
        });

        it("should throw NotFoundException since updated courseInstructor not found", async () => {
            const id = 99;
            const dto: PUTUpdateCourseInstructorsDto = {
                instructorIdList: [1],
                courseId: 1,
            };

            expect(courseInstructorsService.updateCourseInstructors(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(courseInstructorsRepository.getByIdWithFullDetails).toHaveBeenCalledWith(id);
        });
    });
});

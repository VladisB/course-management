import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import { mockQueryBuilder } from "@common/test/mocks";
import { HomeworkViewModelFactory } from "../model-factories";
import { ILessonsRepository } from "@app/lessons/lessons.repository";
import { IUsersRepository } from "@app/users/users.repository";
import { HomeworksService } from "../homeworks.service";
import { Homework } from "../entities/homework.entity";
import {
    homeWorksVMMockList,
    homeworkMockList,
    homeworkStub,
} from "@app/common/test/stubs/homework.stub";
import { IHomeworksRepository } from "../homeworks.repository";
import { mockLessonsRepository, mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { mockHomeworksRepository } from "./mocks";
import { ConfigService } from "@nestjs/config";
import { IFilesService } from "@app/files/files.service.interface";
import { CreateHomeworkDto } from "../dto/create-homework.dto";
import {
    adminUserStub,
    lessonStub,
    studentLGStub,
    studentUserStub,
    unexistedUserStub,
} from "@app/common/test/stubs";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { BaseErrorMessage } from "@app/common/enum";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "@app/common/query-extention";

const queryBuilderMock = mockQueryBuilder<Homework>(homeworkMockList);

describe("homeworksService", () => {
    let homeworkViewModelFactory: HomeworkViewModelFactory;
    let filesService: IFilesService;
    let configService: ConfigService;
    let homeworksRepository: IHomeworksRepository;
    let homeworksService: HomeworksService;
    let lessonRepository: ILessonsRepository;

    let queryBuilder: Partial<SelectQueryBuilder<Homework>>;
    let user: User;
    let userRepository: IUsersRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                HomeworksService,
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn(),
                    },
                },
                {
                    provide: IFilesService,
                    useValue: {
                        uploadFile: jest.fn(),
                        deleteObject: jest.fn(),
                        getSignedReadUrl: jest.fn(),
                    },
                },
                {
                    provide: IHomeworksRepository,
                    useValue: mockHomeworksRepository(),
                },
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: ILessonsRepository,
                    useValue: mockLessonsRepository(),
                },
                { provide: HomeworkViewModelFactory, useClass: HomeworkViewModelFactory },
            ],
        }).compile();

        homeworksService = module.get<HomeworksService>(HomeworksService);
        configService = module.get<ConfigService>(ConfigService);
        filesService = module.get<IFilesService>(IFilesService);
        homeworksRepository = module.get(IHomeworksRepository);
        lessonRepository = module.get(ILessonsRepository);
        userRepository = module.get(IUsersRepository);
        homeworkViewModelFactory = module.get(HomeworkViewModelFactory);

        queryBuilder = queryBuilderMock;
        user = studentUserStub;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("HomeworksService should be defined", () => {
        expect(homeworksService).toBeDefined();
    });

    it("ConfigService should be defined", () => {
        expect(configService).toBeDefined();
    });

    it("FilesService should be defined", () => {
        expect(filesService).toBeDefined();
    });

    it("homeworksRepository should be defined", () => {
        expect(homeworksRepository).toBeDefined();
    });

    it("lessonRepository should be defined", () => {
        expect(lessonRepository).toBeDefined();
    });

    it("homeworkViewModelFactory should be defined", () => {
        expect(homeworkViewModelFactory).toBeDefined();
    });

    describe("create a homework", () => {
        it("should save a homework", async () => {
            const dto: CreateHomeworkDto = {
                lessonId: 1,
            };

            const fileMock: Buffer = Buffer.from("test");

            jest.spyOn(homeworksRepository, "getByLesson").mockResolvedValue(null);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);

            jest.spyOn(homeworksRepository, "create").mockResolvedValue(homeworkStub);
            jest.spyOn(filesService, "getSignedReadUrl").mockResolvedValue(
                "https://test-bucket.s3.amazonaws.com/test",
            );

            const result = await homeworksService.createHomework(dto, fileMock, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                downloadURL: expect.any(String || null),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
        });

        it("should throw an error if homework already exists", async () => {
            const dto: CreateHomeworkDto = {
                lessonId: 1,
            };
            const fileMock: Buffer = Buffer.from("test");

            jest.spyOn(homeworksRepository, "getByLesson").mockResolvedValue(homeworkStub);

            await expect(homeworksService.createHomework(dto, fileMock, user)).rejects.toThrowError(
                new ConflictException(`Homework already exists`),
            );
        });

        it("should throw an error if lesson doesn't exists", async () => {
            const dto: CreateHomeworkDto = {
                lessonId: 1,
            };
            const fileMock: Buffer = Buffer.from("test");

            jest.spyOn(homeworksRepository, "getByLesson").mockResolvedValue(null);

            await expect(homeworksService.createHomework(dto, fileMock, user)).rejects.toThrowError(
                new BadRequestException("Provided lesson not found"),
            );
        });

        it("should throw an error if student doesn't exists", async () => {
            const dto: CreateHomeworkDto = {
                lessonId: 1,
            };
            const fileMock: Buffer = Buffer.from("test");

            jest.spyOn(homeworksRepository, "getByLesson").mockResolvedValue(null);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);

            await expect(homeworksService.createHomework(dto, fileMock, user)).rejects.toThrowError(
                new BadRequestException("Provided student not found"),
            );
        });

        it("should throw an error if student do not assigned to lesson", async () => {
            const dto: CreateHomeworkDto = {
                lessonId: 1,
            };
            const fileMock: Buffer = Buffer.from("test");
            lessonStub.course.id = 999;
            jest.spyOn(homeworksRepository, "getByLesson").mockResolvedValue(null);
            jest.spyOn(lessonRepository, "getById").mockResolvedValue(lessonStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);

            await expect(homeworksService.createHomework(dto, fileMock, user)).rejects.toThrowError(
                new BadRequestException("Provided student is not assigned to the lessons course"),
            );
        });
    });

    describe("get homework by id", () => {
        it("should return homework", async () => {
            const repoSpy = jest
                .spyOn(homeworksRepository, "getById")
                .mockResolvedValue(homeworkStub);
            const id = 1;

            jest.spyOn(filesService, "getSignedReadUrl").mockResolvedValue(
                "https://test-bucket.s3.amazonaws.com/test",
            );

            expect(await homeworksService.getHomework(id)).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                downloadURL: expect.any(String || null),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if homework does not exist", async () => {
            const id = 99;

            expect(homeworksService.getHomework(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(homeworksRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete lesson grade by id", () => {
        it("should delete lesson grade", async () => {
            const repoSpy = jest
                .spyOn(homeworksRepository, "getById")
                .mockResolvedValue(homeworkStub);

            const id = 1;

            const result = await homeworksService.deleteHomework(id, studentUserStub);

            expect(result).toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should delete lesson grade if it's called by admin", async () => {
            const repoSpy = jest
                .spyOn(homeworksRepository, "getById")
                .mockResolvedValue(homeworkStub);

            const id = 1;

            const result = await homeworksService.deleteHomework(id, adminUserStub);

            expect(result).toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if homework to delete does not exist", async () => {
            const id = 99;

            await expect(homeworksService.deleteHomework(id, studentUserStub)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(homeworksRepository.getById).toHaveBeenCalledWith(id);
        });

        it("should throw BadRequestException if user who is not owner tries to delete homework", async () => {
            const id = 99;

            jest.spyOn(homeworksRepository, "getById").mockResolvedValue(homeworkStub);

            await expect(homeworksService.deleteHomework(id, unexistedUserStub)).rejects.toThrow(
                new NotFoundException("You are not the owner of this homework"),
            );
            expect(homeworksRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all homeworks from the repository", () => {
        it("should return a list of homeworks", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(homeworksRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Homework>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                homeworkMockList,
                homeworkMockList.length,
            ]);
            jest.spyOn(homeworkViewModelFactory, "initHomeworkListViewModel").mockReturnValue(
                homeWorksVMMockList,
            );

            const result = await homeworksService.getAllHomeworks(queryParams);

            expect(result.totalRecords).toEqual(homeworkMockList.length);
        });

        it("should return a empty list of homeworks", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(homeworksRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Homework>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(homeworkViewModelFactory, "initHomeworkListViewModel").mockReturnValue([]);

            const result = await homeworksService.getAllHomeworks(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("get all homeworks by student from the repository", () => {
        it("should return a list of homeworks", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(homeworksRepository, "getAllByStudentQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Homework>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                homeworkMockList,
                homeworkMockList.length,
            ]);
            jest.spyOn(homeworkViewModelFactory, "initHomeworkListViewModel").mockReturnValue(
                homeWorksVMMockList,
            );

            const result = await homeworksService.getAllStudentHomeworks(
                queryParams,
                studentUserStub,
            );

            expect(result.totalRecords).toEqual(homeworkMockList.length);
        });

        it("should return a empty list of homeworks", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(homeworksRepository, "getAllByStudentQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Homework>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(homeworkViewModelFactory, "initHomeworkListViewModel").mockReturnValue([]);

            const result = await homeworksService.getAllHomeworks(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update homework", () => {
        it("should return an updated homework", async () => {
            const id = 1;

            const fileMock: Buffer = Buffer.from("Updated test file");

            jest.spyOn(homeworksRepository, "getById").mockResolvedValue(homeworkStub);
            jest.spyOn(userRepository, "getStudentById").mockResolvedValue(studentLGStub);

            jest.spyOn(homeworksRepository, "update").mockResolvedValue(homeworkStub);
            jest.spyOn(filesService, "getSignedReadUrl").mockResolvedValue(
                "https://test-bucket.s3.amazonaws.com/test",
            );

            const result = await homeworksService.updateHomework(id, fileMock, user);

            expect(result).toEqual({
                id: expect.any(Number),
                studentId: expect.any(Number),
                studentName: expect.any(String),
                studentLastName: expect.any(String),
                downloadURL: expect.any(String || null),
                createdBy: expect.any(String),
                modifiedBy: expect.any(String),
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
        });

        it("should throw an error if student doesn't exists", async () => {
            const id = 99;

            const fileMock: Buffer = Buffer.from("Updated test file");

            jest.spyOn(homeworksRepository, "getById").mockResolvedValue(homeworkStub);

            await expect(homeworksService.updateHomework(id, fileMock, user)).rejects.toThrowError(
                new BadRequestException("Provided student not found"),
            );
        });

        it("should throw NotFoundException since updated homework not found", async () => {
            const id = 99;

            const fileMock: Buffer = Buffer.from("Updated test file");

            expect(homeworksService.updateHomework(id, fileMock, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(homeworksRepository.getById).toHaveBeenCalledWith(id);
        });
    });
});

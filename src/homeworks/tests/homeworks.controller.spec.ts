import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { HomeworkViewModel } from "../view-models";
import { homeWorksVMMockList } from "@app/common/test/stubs/homework.stub";
import { HomeworksController } from "../homeworks.controller";
import { HomeworksService } from "../homeworks.service";
import { CreateHomeworkDto } from "../dto/create-homework.dto";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { studentUserStub } from "@app/common/test/stubs";

const getHomeworksVMMockList = () => {
    return new DataListResponse<HomeworkViewModel>(homeWorksVMMockList, homeWorksVMMockList.length);
};

describe("HomeworksController", () => {
    let homeworksController: HomeworksController;
    let homeworksService: HomeworksService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HomeworksController],
            providers: [
                {
                    provide: HomeworksService,
                    useValue: {
                        createHomework: jest.fn().mockResolvedValue(new HomeworkViewModel()),
                        getAllHomeworks: jest.fn().mockResolvedValue(getHomeworksVMMockList()),
                        getAllStudentHomeworks: jest
                            .fn()
                            .mockResolvedValue(getHomeworksVMMockList()),
                        getHomework: jest.fn().mockResolvedValue(new HomeworkViewModel()),
                        updateHomework: jest.fn().mockResolvedValue(new HomeworkViewModel()),
                        deleteHomework: jest.fn().mockResolvedValue(undefined),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(5), // assuming 5MB as default size for testing
                    },
                },
            ],
        })
            .overrideGuard(ThrottlerGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        homeworksController = module.get<HomeworksController>(HomeworksController);
        homeworksService = module.get<HomeworksService>(HomeworksService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a homework", async () => {
            const dto = new CreateHomeworkDto();
            const fileMock: Express.Multer.File = {
                originalname: "file.pdf",
                buffer: Buffer.from("mockFile"),
            } as Express.Multer.File;

            const result = await homeworksController.create(fileMock, user, dto);

            expect(result).toBeInstanceOf(HomeworkViewModel);
            expect(homeworksService.createHomework).toHaveBeenCalledWith(
                dto,
                fileMock.buffer,
                user,
            );
        });
    });

    describe("findAll", () => {
        it("should find all homeworks", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await homeworksController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(HomeworkViewModel);
            expect(homeworksService.getAllHomeworks).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findAll my homeworks(by student)", () => {
        it("should find all homeworks", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await homeworksController.findMy(queryParams, studentUserStub);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(HomeworkViewModel);
            expect(homeworksService.getAllStudentHomeworks).toHaveBeenCalledWith(
                queryParams,
                studentUserStub,
            );
        });
    });

    describe("findOne", () => {
        it("should find a homework by id", async () => {
            const id = 1;

            const result = await homeworksController.findOne(id);

            expect(result).toBeInstanceOf(HomeworkViewModel);
            expect(homeworksService.getHomework).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a homework", async () => {
            const id = 1;
            const fileMock: Express.Multer.File = {
                originalname: "file.pdf",
                buffer: Buffer.from("mockFile"),
            } as Express.Multer.File;

            const result = await homeworksController.update(id, fileMock, user);

            expect(result).toBeInstanceOf(HomeworkViewModel);
            expect(homeworksService.updateHomework).toHaveBeenCalledWith(id, fileMock.buffer, user);
        });
    });

    describe("remove", () => {
        it("should remove a homework as owner", async () => {
            const id = 1;

            const result = await homeworksController.remove(id, studentUserStub);

            expect(result).toBeUndefined();
            expect(homeworksService.deleteHomework).toHaveBeenCalledWith(id, studentUserStub);
        });
    });
});

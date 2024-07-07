import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import {
    adminRoleStub,
    instructorRoleStub,
    lessonVMMockList,
    studentRoleStub,
    unexistedRoleStub,
} from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { LessonsController } from "../lessons.controller";
import { LessonsService } from "../lessons.service";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { LessonViewModel } from "../view-models";
import { UpdateLessonDto } from "../dto/update-lesson.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { ForbiddenException } from "@nestjs/common/exceptions/forbidden.exception";

const getLessonsVMMockList = () => {
    return new DataListResponse<LessonViewModel>(lessonVMMockList, lessonVMMockList.length);
};

describe("LessonsController", () => {
    let lessonsController: LessonsController;
    let lessonsService: LessonsService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonsController],
            providers: [
                {
                    provide: LessonsService,
                    useValue: {
                        createLesson: jest.fn().mockResolvedValue(new LessonViewModel()),
                        getLessons: jest.fn().mockResolvedValue(getLessonsVMMockList()),
                        getInstructorLessons: jest.fn().mockResolvedValue(getLessonsVMMockList()),
                        getStudentLessons: jest.fn().mockResolvedValue(getLessonsVMMockList()),
                        getLesson: jest.fn().mockResolvedValue(new LessonViewModel()),
                        updateLesson: jest.fn().mockResolvedValue(new LessonViewModel()),
                        deleteLesson: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        lessonsController = module.get<LessonsController>(LessonsController);
        lessonsService = module.get<LessonsService>(LessonsService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a lesson", async () => {
            const dto = new CreateLessonDto();

            const result = await lessonsController.create(dto, user);

            expect(result).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.createLesson).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all lessons for admin", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };
            user.role = adminRoleStub;

            const result = await lessonsController.findAll(user, queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.getLessons).toHaveBeenCalledWith(queryParams);
        });

        it("should find all lessons for instructor", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };
            user.role = instructorRoleStub;

            const result = await lessonsController.findAll(user, queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.getInstructorLessons).toHaveBeenCalledWith(queryParams, user.id);
        });

        it("should throw an error if user role is not provided", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };
            user.role = unexistedRoleStub;

            await expect(lessonsController.findAll(user, queryParams)).rejects.toThrowError(
                new ForbiddenException(),
            );
        });
    });

    describe("findStudentLessons", () => {
        it("should find all lessons for student", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };
            user.role = studentRoleStub;

            const result = await lessonsController.findStudentLessons(user, queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.getStudentLessons).toHaveBeenCalledWith(queryParams, user.id);
        });

        it("should throw an error if user role is not provided", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };
            user.role = unexistedRoleStub;

            await expect(lessonsController.findAll(user, queryParams)).rejects.toThrowError(
                new ForbiddenException(),
            );
        });
    });

    describe("findOne", () => {
        it("should find a lesson by id", async () => {
            const id = 1;

            const result = await lessonsController.findOne(id);

            expect(result).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.getLesson).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a role", async () => {
            const id = 1;

            const dto = new UpdateLessonDto();
            const result = await lessonsController.update(id, dto, user);

            expect(result).toBeInstanceOf(LessonViewModel);
            expect(lessonsService.updateLesson).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a lesson", async () => {
            const id = 1;

            const result = await lessonsController.remove(id);

            expect(result).toBeUndefined();
            expect(lessonsService.deleteLesson).toHaveBeenCalledWith(id);
        });
    });
});

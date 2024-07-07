import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { lessonGradeVMMockList } from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { CreateLessonGradeDto } from "../dto/create-lesson-grade.dto";
import { UpdateLessonGradeDto } from "../dto/update-lesson-grade.dto";
import { LessonGradesController } from "../lesson-grades.controller";
import { LessonGradesService } from "../lesson-grades.service";
import { LessonGradeViewModel } from "../view-models";

const getLessonsVMMockList = () => {
    return new DataListResponse<LessonGradeViewModel>(
        lessonGradeVMMockList,
        lessonGradeVMMockList.length,
    );
};

describe("LessonGradesController", () => {
    let lessonGradesController: LessonGradesController;
    let lessonGradesService: LessonGradesService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonGradesController],
            providers: [
                {
                    provide: LessonGradesService,
                    useValue: {
                        createGrade: jest.fn().mockResolvedValue(new LessonGradeViewModel()),
                        getAllGrades: jest.fn().mockResolvedValue(getLessonsVMMockList()),
                        getGrade: jest.fn().mockResolvedValue(new LessonGradeViewModel()),
                        updateGrade: jest.fn().mockResolvedValue(new LessonGradeViewModel()),
                        deleteGrade: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        lessonGradesController = module.get<LessonGradesController>(LessonGradesController);
        lessonGradesService = module.get<LessonGradesService>(LessonGradesService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a lesson grade", async () => {
            const dto = new CreateLessonGradeDto();

            const result = await lessonGradesController.create(dto, user);

            expect(result).toBeInstanceOf(LessonGradeViewModel);
            expect(lessonGradesService.createGrade).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all lessons", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await lessonGradesController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(LessonGradeViewModel);
            expect(lessonGradesService.getAllGrades).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a lesson grade by id", async () => {
            const id = 1;

            const result = await lessonGradesController.findOne(id);

            expect(result).toBeInstanceOf(LessonGradeViewModel);
            expect(lessonGradesService.getGrade).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a role", async () => {
            const id = 1;

            const dto = new UpdateLessonGradeDto();
            const result = await lessonGradesController.update(id, dto, user);

            expect(result).toBeInstanceOf(LessonGradeViewModel);
            expect(lessonGradesService.updateGrade).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a lesson grade", async () => {
            const id = 1;

            const result = await lessonGradesController.remove(id);

            expect(result).toBeUndefined();
            expect(lessonGradesService.deleteGrade).toHaveBeenCalledWith(id);
        });
    });
});

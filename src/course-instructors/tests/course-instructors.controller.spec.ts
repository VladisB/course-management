import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { courseInstructorsListVMMockList } from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { CourseInstructorsController } from "../course-instructors.controller";
import { CourseInstructorsService } from "../course-instructors.service";
import {
    CourseInstructorViewModel,
    CourseInstructorsListViewModel,
    CourseInstructorsViewModel,
} from "../view-models";
import { CreateCourseInstructorsDto } from "../dto/create-course-instructors.dto";
import { PUTUpdateCourseInstructorsDto } from "../dto/put-update-course-instructors.dto";

const getCourseInstructorsVMMockList = () => {
    return new DataListResponse<CourseInstructorsListViewModel>(
        courseInstructorsListVMMockList,
        courseInstructorsListVMMockList.length,
    );
};

describe("CourseInstructorsController", () => {
    let courseInstructorsController: CourseInstructorsController;
    let courseInstructorsService: CourseInstructorsService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CourseInstructorsController],
            providers: [
                {
                    provide: CourseInstructorsService,
                    useValue: {
                        createCourseInstructors: jest
                            .fn()
                            .mockResolvedValue(new CourseInstructorsViewModel()),
                        getCourseInstructors: jest
                            .fn()
                            .mockResolvedValue(getCourseInstructorsVMMockList()),
                        getCourseInstructor: jest
                            .fn()
                            .mockResolvedValue(new CourseInstructorViewModel()),
                        updateCourseInstructors: jest
                            .fn()
                            .mockResolvedValue(new CourseInstructorsViewModel()),
                        deleteCourseInstructors: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        courseInstructorsController = module.get<CourseInstructorsController>(
            CourseInstructorsController,
        );
        courseInstructorsService = module.get<CourseInstructorsService>(CourseInstructorsService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a courseInstructor", async () => {
            const dto = new CreateCourseInstructorsDto();

            const result = await courseInstructorsController.create(dto, user);

            expect(result).toBeInstanceOf(CourseInstructorsViewModel);
            expect(courseInstructorsService.createCourseInstructors).toHaveBeenCalledWith(
                dto,
                user,
            );
        });
    });

    describe("findAll", () => {
        it("should find all courseInstructors", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await courseInstructorsController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(CourseInstructorsListViewModel);
            expect(courseInstructorsService.getCourseInstructors).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a courseInstructors by id", async () => {
            const id = 1;

            const result = await courseInstructorsController.findOne(id);

            expect(result).toBeInstanceOf(CourseInstructorViewModel);
            expect(courseInstructorsService.getCourseInstructor).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update courseInstructors", async () => {
            const id = 1;

            const dto = new PUTUpdateCourseInstructorsDto();

            const result = await courseInstructorsController.update(id, dto, user);

            expect(result).toBeInstanceOf(CourseInstructorsViewModel);
            expect(courseInstructorsService.updateCourseInstructors).toHaveBeenCalledWith(
                id,
                dto,
                user,
            );
        });
    });

    describe("remove", () => {
        it("should remove a courseInstructor", async () => {
            const id = 1;

            const result = await courseInstructorsController.remove(id);

            expect(result).toBeUndefined();
            expect(courseInstructorsService.deleteCourseInstructors).toHaveBeenCalledWith(id);
        });
    });
});

import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { courseVMMockList } from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { CourseViewModel } from "../view-models";
import { CoursesController } from "../courses.controller";
import { CoursesService } from "../courses.service";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";

const getCoursesVMMockList = () => {
    return new DataListResponse<CourseViewModel>(courseVMMockList, courseVMMockList.length);
};

describe("CoursesController", () => {
    let coursesController: CoursesController;
    let coursesService: CoursesService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoursesController],
            providers: [
                {
                    provide: CoursesService,
                    useValue: {
                        createCourse: jest.fn().mockResolvedValue(new CourseViewModel()),
                        getCourses: jest.fn().mockResolvedValue(getCoursesVMMockList()),
                        getCourse: jest.fn().mockResolvedValue(new CourseViewModel()),
                        updateCourse: jest.fn().mockResolvedValue(new CourseViewModel()),
                        deleteCourse: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        coursesController = module.get<CoursesController>(CoursesController);
        coursesService = module.get<CoursesService>(CoursesService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a group", async () => {
            const dto = new CreateCourseDto();

            const result = await coursesController.create(dto, user);

            expect(result).toBeInstanceOf(CourseViewModel);
            expect(coursesService.createCourse).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all courses", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await coursesController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(CourseViewModel);
            expect(coursesService.getCourses).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a course by id", async () => {
            const id = 1;

            const result = await coursesController.findOne(id);

            expect(result).toBeInstanceOf(CourseViewModel);
            expect(coursesService.getCourse).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a group", async () => {
            const id = 1;

            const dto = new UpdateCourseDto();
            const result = await coursesController.update(id, dto, user);

            expect(result).toBeInstanceOf(CourseViewModel);
            expect(coursesService.updateCourse).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a group", async () => {
            const id = 1;

            const result = await coursesController.remove(id);

            expect(result).toBeUndefined();
            expect(coursesService.deleteCourse).toHaveBeenCalledWith(id);
        });
    });
});

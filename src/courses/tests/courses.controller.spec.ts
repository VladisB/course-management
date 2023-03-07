import { Test, TestingModule } from "@nestjs/testing";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { CoursesController } from "../courses.controller";
import { CoursesService } from "../courses.service";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "../dto/update-course.dto";
import { Course } from "../entities/course.entity";
import { CourseViewModel } from "../view-models";
import { coursesMock } from "./mocks";

const coursesViewModelMock: CourseViewModel[] = [
    {
        id: 1,
        name: "Hardware engineering",
    },
    {
        id: 2,
        name: "Software engineering",
    },
];

// const mockCoursesService = {
//     getCourses: jest.fn().mockResolvedValue(coursesMock),
//     createCourses: jest.fn((dto: CreateCourseDto) => {
//         const course = new Course();
//         course.name = dto.name;
//         course.id = 1;

//         return course;
//     }),
// };

export const mockCoursesService = {
    createCourse: jest.fn((dto: CreateCourseDto): Promise<Course> => {
        const createdCourse = coursesMock[0];

        return Promise.resolve(createdCourse);
    }),
    getCourses: jest.fn(
        (queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>> => {
            const courses: Course[] = [...coursesMock];
            const dataListResponse: DataListResponse<CourseViewModel> = {
                records: coursesViewModelMock,
                totalRecords: courses.length,
            };
            return Promise.resolve(dataListResponse);
        },
    ),
    getCourse: jest.fn((id: number): Promise<CourseViewModel> => {
        const course: CourseViewModel = { id, name: "Course " + id };

        return Promise.resolve(course);
    }),
    updateCourse: jest.fn((id: number, dto: UpdateCourseDto): Promise<CourseViewModel> => {
        const updatedCourse: CourseViewModel = { id, name: dto.name };
        return Promise.resolve(updatedCourse);
    }),
    deleteCourse: jest.fn((id: number): Promise<void> => {
        return Promise.resolve();
    }),
};

describe("CoursesController", () => {
    let controller: CoursesController;
    let service: CoursesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoursesController],
            providers: [CoursesService],
        }).compile();

        controller = module.get<CoursesController>(CoursesController);
        service = module.get<CoursesService>(CoursesService);
    });

    describe("create", () => {
        it("should create a new course", async () => {
            const createDto: CreateCourseDto = {
                name: "Test Course",
            };
            const expected: CourseViewModel = {
                id: 1,
                name: "Test Course",
            };

            jest.spyOn(service, "createCourse").mockResolvedValue(expected);

            const result = await controller.create(createDto);
            expect(result).toEqual(expected);
        });
    });

    describe("findAll", () => {
        it("should return a list of courses", async () => {
            const queryParams: QueryParamsDTO = {
                page: 1,
                limit: 10,
            };
            const expected: DataListResponse<CourseViewModel> = {
                items: [
                    { id: 1, name: "Course 1" },
                    { id: 2, name: "Course 2" },
                    { id: 3, name: "Course 3" },
                ],
                total: 3,
                page: 1,
                limit: 10,
            };
            jest.spyOn(service, "getCourses").mockResolvedValue(expected);

            const result = await controller.findAll(queryParams);
            expect(result).toEqual(expected);
        });
    });

    describe("findOne", () => {
        it("should return a course with the given ID", async () => {
            const expected: CourseViewModel = {
                id: 1,
                name: "Test Course",
            };
            jest.spyOn(service, "getCourse").mockResolvedValue(expected);

            const result = await controller.findOne(1);
            expect(result).toEqual(expected);
        });
    });

    describe("update", () => {
        it("should update a course with the given ID", async () => {
            const updateDto: UpdateCourseDto = {
                name: "Updated Course",
            };
            const expected: CourseViewModel = {
                id: 1,
                name: "Updated Course",
            };
            jest.spyOn(service, "updateCourse").mockResolvedValue(expected);

            const result = await controller.update(1, updateDto);
            expect(result).toEqual(expected);
        });
    });

    describe("remove", () => {
        it("should delete a course with the given ID", async () => {
            jest.spyOn(service, "deleteCourse").mockResolvedValue(undefined);

            const result = await controller.remove(1);
            expect(result).toBeUndefined();
        });
    });
});

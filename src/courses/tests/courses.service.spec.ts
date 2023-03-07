import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { coursesMock } from "./mocks";
import { Course } from "../entities/course.entity";
import { CreateCourseDto } from "../dto/create-course.dto";
import { CoursesService } from "../courses.service";

const mockCourseRepository = () => ({
    find: jest.fn().mockResolvedValue(coursesMock),
    create: jest.fn((dto: CreateCourseDto) => {
        const course = new Course();
        course.name = dto.name;

        return course;
    }),
    save: jest.fn().mockImplementation((course: Course): Promise<Course> => {
        course.id = 1;
        return Promise.resolve(course);
    }),
});

const USER_REPOSITORY_TOKEN = getRepositoryToken(Course);

describe("Courses Service", () => {
    let createService: CoursesService;
    let createRepository: Repository<Course>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoursesService,
                { provide: USER_REPOSITORY_TOKEN, useFactory: mockCourseRepository },
            ],
        }).compile();

        createService = module.get<CoursesService>(CoursesService);
        createRepository = module.get(USER_REPOSITORY_TOKEN);
    });

    it("Courses Service should be defined", () => {
        expect(createService).toBeDefined();
    });

    it("Courses Repository should be defined", () => {
        expect(createRepository).toBeDefined();
    });
});

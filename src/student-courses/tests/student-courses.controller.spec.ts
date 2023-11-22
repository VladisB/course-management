import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { StudentCoursesViewModel } from "../view-models";
import { StudentCoursesController } from "../student-courses.controller";
import { StudentCoursesService } from "../student-courses.service";
import { CreateStudentCoursesDto } from "../dto/create-student-courses.dto";
import { PATCHUpdateStudentCoursesDto } from "../dto/update-student-courses.dto";
import { studentCoursesViewModelMockList } from "@app/common/test/stubs";

const getStudentCoursesViewModelsVMMockList = () => {
    return new DataListResponse<StudentCoursesViewModel>(
        studentCoursesViewModelMockList,
        studentCoursesViewModelMockList.length,
    );
};

describe("StudentCoursesController", () => {
    let studentCoursesController: StudentCoursesController;
    let studentCoursesService: StudentCoursesService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentCoursesController],
            providers: [
                {
                    provide: StudentCoursesService,
                    useValue: {
                        createStudentCourse: jest
                            .fn()
                            .mockResolvedValue(new StudentCoursesViewModel()),
                        getStudentCourses: jest
                            .fn()
                            .mockResolvedValue(getStudentCoursesViewModelsVMMockList()),
                        getStudentCourse: jest
                            .fn()
                            .mockResolvedValue(new StudentCoursesViewModel()),
                        updateStudentCourse: jest
                            .fn()
                            .mockResolvedValue(new StudentCoursesViewModel()),
                        deleteStudentCourse: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        studentCoursesController = module.get<StudentCoursesController>(StudentCoursesController);
        studentCoursesService = module.get<StudentCoursesService>(StudentCoursesService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a studentCourse", async () => {
            const dto = new CreateStudentCoursesDto();

            const result = await studentCoursesController.create(dto, user);

            expect(result).toBeInstanceOf(StudentCoursesViewModel);
            expect(studentCoursesService.createStudentCourse).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all studentCourses", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await studentCoursesController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(StudentCoursesViewModel);
            expect(studentCoursesService.getStudentCourses).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a studentCourse by id", async () => {
            const id = 1;

            const result = await studentCoursesController.findOne(id);

            expect(result).toBeInstanceOf(StudentCoursesViewModel);
            expect(studentCoursesService.getStudentCourse).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update studentCourse", async () => {
            const id = 1;

            const dto = new PATCHUpdateStudentCoursesDto();

            const result = await studentCoursesController.update(id, dto, user);

            expect(result).toBeInstanceOf(StudentCoursesViewModel);
            expect(studentCoursesService.updateStudentCourse).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a studentCourse", async () => {
            const id = 1;

            const result = await studentCoursesController.remove(id);

            expect(result).toBeUndefined();
            expect(studentCoursesService.deleteStudentCourse).toHaveBeenCalledWith(id);
        });
    });
});

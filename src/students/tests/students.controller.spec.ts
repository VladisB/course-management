import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { StudentsController } from "../students.controller";
import { IStudentsService } from "../students.service";
import {
    StudentCourseViewModel,
    StudentDetailsViewModel,
    StudentListViewModel,
} from "../view-models";
import { studentCourseViewModelList, studentVMMockList } from "@app/common/test/stubs";

const getStudentsVMMockList = () => {
    return new DataListResponse<StudentListViewModel>(studentVMMockList, studentVMMockList.length);
};

describe("StudentsController", () => {
    let studentsController: StudentsController;
    let studentsService: IStudentsService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentsController],
            providers: [
                {
                    provide: IStudentsService,
                    useValue: {
                        getAllStudents: jest.fn().mockResolvedValue(getStudentsVMMockList()),
                        getStudentCourses: jest.fn().mockResolvedValue(studentCourseViewModelList),
                        getStudent: jest.fn().mockResolvedValue(new StudentDetailsViewModel()),
                    },
                },
            ],
        }).compile();

        studentsController = module.get<StudentsController>(StudentsController);
        studentsService = module.get<IStudentsService>(IStudentsService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("findAll", () => {
        it("should find all students", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await studentsController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(StudentListViewModel);
            expect(result).toBeInstanceOf(DataListResponse<StudentListViewModel>);
            expect(studentsService.getAllStudents).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a user by id", async () => {
            const id = 1;

            const result = await studentsController.findOne(id);

            expect(result).toBeInstanceOf(StudentDetailsViewModel);
            expect(studentsService.getStudent).toHaveBeenCalledWith(id);
        });
    });

    describe("findStudentCourses", () => {
        it("should find student courses by user id", async () => {
            const result = await studentsController.findStudentCourses(user);

            expect(result[0]).toBeInstanceOf(StudentCourseViewModel);
            expect(studentsService.getStudentCourses).toHaveBeenCalledWith(user.id);
        });
    });
});

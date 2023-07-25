import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { FacultiesService } from "../faculties.service";
import { FacultiesController } from "../faculties.controller";
import { FacultyViewModel } from "../view-models";
import { CreateFacultyDto } from "../dto/create-faculty.dto";
import { facultyVMMockList } from "@app/common/test/stubs";
import { UpdateFacultyDto } from "../dto/update-faculty.dto";

const getFacultyVMMockList = () => {
    return new DataListResponse<FacultyViewModel>(facultyVMMockList, facultyVMMockList.length);
};

describe("FacultiesController", () => {
    let facultiesController: FacultiesController;
    let facultyService: FacultiesService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FacultiesController],
            providers: [
                {
                    provide: FacultiesService,
                    useValue: {
                        createFaculty: jest.fn().mockResolvedValue(new FacultyViewModel()),
                        getFaculties: jest.fn().mockResolvedValue(getFacultyVMMockList()),
                        getFaculty: jest.fn().mockResolvedValue(new FacultyViewModel()),
                        updateFaculty: jest.fn().mockResolvedValue(new FacultyViewModel()),
                        deleteFaculty: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        facultiesController = module.get<FacultiesController>(FacultiesController);
        facultyService = module.get<FacultiesService>(FacultiesService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a faculty", async () => {
            const dto = new CreateFacultyDto();

            const result = await facultiesController.create(dto, user);

            expect(result).toBeInstanceOf(FacultyViewModel);
            expect(facultyService.createFaculty).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all faculties", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await facultiesController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(FacultyViewModel);
            expect(facultyService.getFaculties).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a faculty by id", async () => {
            const id = 1;

            const result = await facultiesController.findOne(id);

            expect(result).toBeInstanceOf(FacultyViewModel);
            expect(facultyService.getFaculty).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a faculty", async () => {
            const id = 1;

            const dto = new UpdateFacultyDto();
            const result = await facultiesController.update(id, dto, user);

            expect(result).toBeInstanceOf(FacultyViewModel);
            expect(facultyService.updateFaculty).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a lesson", async () => {
            const id = 1;

            const result = await facultiesController.remove(id);

            expect(result).toBeUndefined();
            expect(facultyService.deleteFaculty).toHaveBeenCalledWith(id);
        });
    });
});

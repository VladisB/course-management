import { Test, TestingModule } from "@nestjs/testing";
import { CreateFacultyDto } from "../dto/create-faculty.dto";
import { FacultiesController } from "../faculties.controller";
import { FacultiesService } from "../faculties.service";
import { Faculty } from "../faculty.entity";
import { facultiesMock } from "./mocks";

const mockFacultiesService = {
    getFaculties: jest.fn().mockResolvedValue(facultiesMock),
    createFaculty: jest.fn((dto: CreateFacultyDto) => {
        const faculty = new Faculty();
        faculty.name = dto.name;
        faculty.id = 1;

        return faculty;
    }),
};

describe("FacultiesController", () => {
    let controller: FacultiesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FacultiesController],
            providers: [FacultiesService],
        })
            .overrideProvider(FacultiesService)
            .useValue(mockFacultiesService)
            .compile();

        controller = module.get<FacultiesController>(FacultiesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create a faculty", () => {
        it("should create new role", async () => {
            const createDto: CreateFacultyDto = {
                name: "mock faculty",
            };

            expect(controller.create(createDto)).toEqual({
                id: expect.any(Number),
                name: createDto.name,
            });
            expect(controller.create(createDto)).toBeInstanceOf(Faculty);
        });
    });

    describe("Get faculties", () => {
        it("successfully retrieve faculties", async () => {
            const faculties = await controller.getFaculties();

            expect(faculties).toEqual(facultiesMock);
        });
    });
});

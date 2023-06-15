// import { Test, TestingModule } from "@nestjs/testing";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { CreateFacultyDto } from "../dto/create-faculty.dto";
// import { FacultiesService } from "../faculties.service";
// import { Faculty } from "../entities/faculty.entity";
// import { facultiesMock } from "./mocks";

// const mockFacultyRepository = () => ({
//     find: jest.fn().mockResolvedValue(facultiesMock),
//     create: jest.fn((dto: CreateFacultyDto) => {
//         const faculty = new Faculty();
//         faculty.name = dto.name;

//         return faculty;
//     }),
//     save: jest.fn().mockImplementation((faculty: Faculty): Promise<Faculty> => {
//         faculty.id = 1;
//         return Promise.resolve(faculty);
//     }),
// });

// const USER_REPOSITORY_TOKEN = getRepositoryToken(Faculty);

// describe("FacultiesService", () => {
//     let facultiesService: FacultiesService;
//     let facultiesRepository: Repository<Faculty>;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 FacultiesService,
//                 { provide: USER_REPOSITORY_TOKEN, useFactory: mockFacultyRepository },
//             ],
//         }).compile();

//         facultiesService = module.get<FacultiesService>(FacultiesService);
//         facultiesRepository = module.get(USER_REPOSITORY_TOKEN);
//     });

//     it("FacultiesService should be defined", () => {
//         expect(facultiesService).toBeDefined();
//     });

//     it("facultiesRepository should be defined", () => {
//         expect(facultiesRepository).toBeDefined();
//     });

//     describe("create a faculty", () => {
//         it("should save the new role", async () => {
//             const createDto: CreateFacultyDto = {
//                 name: "mock faculty",
//             };

//             const result = await facultiesService.createFaculty(createDto);
//             expect(result).toEqual({
//                 id: expect.any(Number),
//                 name: createDto.name,
//             });
//             expect(result).toBeInstanceOf(Faculty);
//         });

//         //TODO: Cover error case
//     });

//     describe("Get all faculties from the repository", () => {
//         it("should return an array of faculties", async () => {
//             const faculties = await facultiesService.getFaculties();

//             expect(faculties).toEqual(facultiesMock);
//         });
//     });
// });

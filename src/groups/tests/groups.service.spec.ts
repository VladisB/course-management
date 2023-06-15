// import { Test, TestingModule } from "@nestjs/testing";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { CreateGroupDto } from "../dto/create-group.dto";
// import { Group } from "../entities/group.entity";
// import { GroupsService } from "../groups.service";
// import { createDto, groupsMock } from "./mocks";

// const mockGroupRepository = () => ({
//     find: jest.fn().mockResolvedValue(groupsMock),
//     create: jest.fn((dto: CreateGroupDto) => {
//         const group = new Group();
//         group.name = dto.name;

//         return group;
//     }),
//     save: jest.fn().mockImplementation((group: Group): Promise<Group> => {
//         group.id = 1;
//         return Promise.resolve(group);
//     }),
// });

// const GROUP_REPOSITORY_TOKEN = getRepositoryToken(Group);

// describe("GroupsService", () => {
//     let groupsService: GroupsService;
//     let groupsRepository: Repository<Group>;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 GroupsService,
//                 { provide: GROUP_REPOSITORY_TOKEN, useFactory: mockGroupRepository },
//             ],
//         }).compile();

//         groupsService = module.get<GroupsService>(GroupsService);
//         groupsRepository = module.get(GROUP_REPOSITORY_TOKEN);
//     });

//     it("FacultiesService should be defined", () => {
//         expect(groupsService).toBeDefined();
//     });

//     it("facultiesRepository should be defined", () => {
//         expect(groupsRepository).toBeDefined();
//     });

//     describe("create a faculty", () => {
//         it("should save the new role", async () => {
//             const result = await groupsService.createGroup(createDto);
//             expect(result).toEqual({
//                 id: expect.any(Number),
//                 name: createDto.name,
//             });
//             expect(result).toBeInstanceOf(Group);
//         });

//         //TODO: Cover error case
//     });

//     describe("Get all groups from the repository", () => {
//         it("should return an array of groups", async () => {
//             const faculties = await groupsService.getGroups();

//             expect(faculties).toEqual(groupsMock);
//         });
//     });
// });

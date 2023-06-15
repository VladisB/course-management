// import { Test, TestingModule } from "@nestjs/testing";
// import { CreateGroupDto } from "../dto/create-group.dto";
// import { Group } from "../entities/group.entity";
// import { GroupsController } from "../groups.controller";
// import { GroupsService } from "../groups.service";
// import { createDto, groupsMock } from "./mocks";

// const mockGroupsService = {
//     getGroups: jest.fn().mockResolvedValue(groupsMock),
//     createGroup: jest.fn((dto: CreateGroupDto) => {
//         const group = new Group();
//         group.name = dto.name;
//         group.id = 1;

//         return group;
//     }),
// };

// describe("GroupsController", () => {
//     let controller: GroupsController;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [GroupsController],
//             providers: [GroupsService],
//         })
//             .overrideProvider(GroupsService)
//             .useValue(mockGroupsService)
//             .compile();

//         controller = module.get<GroupsController>(GroupsController);
//     });

//     it("should be defined", () => {
//         expect(controller).toBeDefined();
//     });

//     describe("create a group", () => {
//         it("should create new group", async () => {
//             expect(controller.create(createDto)).toEqual({
//                 id: expect.any(Number),
//                 name: createDto.name,
//             });
//             expect(controller.create(createDto)).toBeInstanceOf(Group);
//         });
//     });

//     describe("Get groups", () => {
//         it("successfully retrieve groups", async () => {
//             const groups = await controller.getGroups();

//             expect(groups).toEqual(groupsMock);
//         });
//     });
// });

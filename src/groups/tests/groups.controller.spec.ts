import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { groupVMMockList } from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { GroupViewModel } from "../view-models";
import { GroupsController } from "../groups.controller";
import { GroupsService } from "../groups.service";
import { CreateGroupDto } from "../dto/create-group.dto";
import { UpdateGroupDto } from "../dto/update-group.dto";

const getGroupsVMMockList = () => {
    return new DataListResponse<GroupViewModel>(groupVMMockList, groupVMMockList.length);
};

describe("GroupsController", () => {
    let groupsController: GroupsController;
    let groupsService: GroupsService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GroupsController],
            providers: [
                {
                    provide: GroupsService,
                    useValue: {
                        createGroup: jest.fn().mockResolvedValue(new GroupViewModel()),
                        getGroups: jest.fn().mockResolvedValue(getGroupsVMMockList()),
                        getGroup: jest.fn().mockResolvedValue(new GroupViewModel()),
                        updateGroup: jest.fn().mockResolvedValue(new GroupViewModel()),
                        deleteGroup: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        groupsController = module.get<GroupsController>(GroupsController);
        groupsService = module.get<GroupsService>(GroupsService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a group", async () => {
            const dto = new CreateGroupDto();

            const result = await groupsController.create(dto, user);

            expect(result).toBeInstanceOf(GroupViewModel);
            expect(groupsService.createGroup).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all lessons for admin", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await groupsController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(GroupViewModel);
            expect(groupsService.getGroups).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a group by id", async () => {
            const id = 1;

            const result = await groupsController.findOne(id);

            expect(result).toBeInstanceOf(GroupViewModel);
            expect(groupsService.getGroup).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update a group", async () => {
            const id = 1;

            const dto = new UpdateGroupDto();
            const result = await groupsController.update(id, dto, user);

            expect(result).toBeInstanceOf(GroupViewModel);
            expect(groupsService.updateGroup).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove a group", async () => {
            const id = 1;

            const result = await groupsController.remove(id);

            expect(result).toBeUndefined();
            expect(groupsService.deleteGroup).toHaveBeenCalledWith(id);
        });
    });
});

import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { DataListResponse } from "@app/common/db/data-list-response";
import { userVMMList } from "@app/common/test/stubs";
import { UsersController } from "../users-management.controller";
import { IUsersManagementService } from "../users-management.service";
import { UserViewModel } from "@app/users/view-models";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { UpdateUserDto } from "@app/users/dto/update-user.dto";

const getUsersViewModelsVMMockList = () => {
    return new DataListResponse<UserViewModel>(userVMMList, userVMMList.length);
};

describe("UsersController", () => {
    let usersController: UsersController;
    let usersManagementService: IUsersManagementService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: IUsersManagementService,
                    useValue: {
                        createUser: jest.fn().mockResolvedValue(new UserViewModel()),
                        getAllUsers: jest.fn().mockResolvedValue(getUsersViewModelsVMMockList()),
                        getUser: jest.fn().mockResolvedValue(new UserViewModel()),
                        updateUser: jest.fn().mockResolvedValue(new UserViewModel()),
                        deleteUser: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersManagementService = module.get<IUsersManagementService>(IUsersManagementService);
        user = new User();
    });

    afterEach(() => {
        jest.resetAllMocks();
        user = null;
    });

    describe("create", () => {
        it("should create a user", async () => {
            const dto = new CreateUserDto();

            const result = await usersController.create(dto, user);

            expect(result).toBeInstanceOf(UserViewModel);
            expect(usersManagementService.createUser).toHaveBeenCalledWith(dto, user);
        });
    });

    describe("findAll", () => {
        it("should find all users", async () => {
            const queryParams: QueryParamsDTO = {
                limit: 10,
                page: 0,
            };

            const result = await usersController.findAll(queryParams);

            expect(Array.isArray(result.records)).toBe(true);
            expect(result.records[0]).toBeInstanceOf(UserViewModel);
            expect(usersManagementService.getAllUsers).toHaveBeenCalledWith(queryParams);
        });
    });

    describe("findOne", () => {
        it("should find a user by id", async () => {
            const id = 1;

            const result = await usersController.findOne(id);

            expect(result).toBeInstanceOf(UserViewModel);
            expect(usersManagementService.getUser).toHaveBeenCalledWith(id);
        });
    });

    describe("update", () => {
        it("should update studentCourse", async () => {
            const id = 1;

            const dto = new UpdateUserDto();

            const result = await usersController.update(id, dto, user);

            expect(result).toBeInstanceOf(UserViewModel);
            expect(usersManagementService.updateUser).toHaveBeenCalledWith(id, dto, user);
        });
    });

    describe("remove", () => {
        it("should remove user", async () => {
            const id = 1;

            const result = await usersController.remove(id);

            expect(result).toBeUndefined();
            expect(usersManagementService.deleteUser).toHaveBeenCalledWith(id);
        });
    });
});

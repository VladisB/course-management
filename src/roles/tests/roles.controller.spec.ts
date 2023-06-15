import { User } from "@app/users/entities/user.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { CreateRoleDto } from "../dto/create-role.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { RolesController } from "../roles.controller";
import { RolesService } from "../roles.service";
import { RoleViewModel } from "../view-models";
import { rolesMock } from "@app/common/test/stubs";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";

describe("RolesController", () => {
    let rolesController: RolesController;
    let rolesService: RolesService;
    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                {
                    provide: RolesService,
                    useValue: {
                        createRole: jest.fn().mockResolvedValue(new RoleViewModel()),
                        getRoles: jest.fn().mockResolvedValue(rolesMock),
                        getRole: jest.fn().mockResolvedValue(new RoleViewModel()),
                        updateRole: jest.fn().mockResolvedValue(new RoleViewModel()),
                        deleteRole: jest.fn().mockResolvedValue(undefined),
                    },
                },
            ],
        }).compile();

        rolesController = module.get<RolesController>(RolesController);
        rolesService = module.get<RolesService>(RolesService);
        user = new User();
    });

    it("should create a role", async () => {
        const dto = new CreateRoleDto();

        const result = await rolesController.create(dto, user);

        expect(result).toBeInstanceOf(RoleViewModel);
        expect(rolesService.createRole).toHaveBeenCalledWith(dto, user);
    });

    it("should find all roles", async () => {
        const queryParams: QueryParamsDTO = {
            limit: 10,
            page: 0,
        };

        const result = await rolesController.findAll(queryParams);

        expect(Array.isArray(result)).toBe(true);
        expect(rolesService.getRoles).toHaveBeenCalledWith(queryParams);
    });

    it("should find a role by id", async () => {
        const id = 1;

        const result = await rolesController.findOne(id);

        expect(result).toBeInstanceOf(RoleViewModel);
        expect(rolesService.getRole).toHaveBeenCalledWith(id);
    });

    it("should update a role", async () => {
        const id = 1;

        const dto = new UpdateRoleDto();
        const result = await rolesController.update(id, dto, user);

        expect(result).toBeInstanceOf(RoleViewModel);
        expect(rolesService.updateRole).toHaveBeenCalledWith(id, dto, user);
    });

    it("should remove a role", async () => {
        const id = 1;

        const result = await rolesController.remove(id);

        expect(result).toBeUndefined();
        expect(rolesService.deleteRole).toHaveBeenCalledWith(id);
    });
});

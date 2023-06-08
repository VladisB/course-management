import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { Strategies } from "src/auth/strategies.enum";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { IUsersViewModelFactory } from "src/users/model-factories/users.vm-factory";
import { UserViewModel } from "src/users/view-models";
import { IUsersManagementService } from "./users-management.service";
import { RoleName } from "src/common/enum";

@Controller("users-management")
@Roles(RoleName.Admin)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
export class UsersController {
    constructor(
        private usersManagementService: IUsersManagementService,
        private usersViewModelFactory: IUsersViewModelFactory,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() userDto: CreateUserDto): Promise<UserViewModel> {
        const model = await this.usersManagementService.createUser(userDto);

        return this.usersViewModelFactory.initUserViewModel(model);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>> {
        return this.usersManagementService.getAllUsers(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<UserViewModel> {
        return this.usersManagementService.getUser(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserViewModel> {
        return this.usersManagementService.updateUser(id, updateUserDto);
    }

    // TODO: Update validation rules. Check if user has related entities.
    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.usersManagementService.deleteUser(id);
    }
}

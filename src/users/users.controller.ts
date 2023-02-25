import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { RoleName } from "../roles/roles.enum";
import { UserViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { UsersViewModelFactory } from "./model-factories";

@Controller("users")
@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private usersViewModelFactory: UsersViewModelFactory,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() userDto: CreateUserDto): Promise<UserViewModel> {
        const model = await this.usersService.createUser(userDto);

        return this.usersViewModelFactory.initUserViewModel(model);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>> {
        return this.usersService.getAllUsers(queryParams);
    }

    @Get(":id")
    findOne(@Param("id") id: number): Promise<UserViewModel> {
        return this.usersService.getUser(id);
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.usersService.deleteUser(id);
    }
}

import {
    Body,
    Controller,
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
import { User } from "./user.entity";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { RoleName } from "../roles/roles.enum";
import { UserViewModel } from "./view-models";
import { DataListResponse } from "src/infrastructure/common/db/data-list-response";
import { QueryParamsDTO } from "../infrastructure/common/dto/query-params.dto";

@Controller("users")
@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() userDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(userDto);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    getAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>> {
        return this.usersService.getAllUsers(queryParams);
    }

    @Patch(":id")
    updateUser(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);
    }
}

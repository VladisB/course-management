import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import { RolesGuard } from "../roles/roles.guard";
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { IUsersManagementService } from "./users-management.service";
import { RoleName } from "@common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { Strategies } from "@app/auth/strategies.enum";
import { UpdateUserDto } from "@app/users/dto/update-user.dto";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseForbidden,
    CommonApiResponseInternalServerError,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserViewModel } from "@app/users/view-models";

@Controller("users-management")
@Roles(RoleName.Admin)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Users management")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class UsersController {
    constructor (private usersManagementService: IUsersManagementService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created user",
        type: UserViewModel,
    })
    @CommonApiResponseConflict()
    async create(@Body() userDto: CreateUserDto, @GetUser() user: User): Promise<UserViewModel> {
        return this.usersManagementService.createUser(userDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get users" })
    @OpenApiPaginationResponse(UserViewModel, "Get users")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>> {
        return this.usersManagementService.getAllUsers(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get user" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get user",
        type: UserViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<UserViewModel> {
        return this.usersManagementService.getUser(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update user" })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated user",
        type: UserViewModel,
    })
    @CommonApiResponseConflict()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @GetUser() user: User,
    ): Promise<UserViewModel> {
        return this.usersManagementService.updateUser(id, updateUserDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete user" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Deleted user",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.usersManagementService.deleteUser(id);
    }
}

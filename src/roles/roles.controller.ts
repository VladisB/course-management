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
import { CreateRoleDto } from "./dto/create-role.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { GetUser } from "@app/auth/get-user.decorator";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { RoleName } from "@common/enum";
import { RoleViewModel } from "./view-models";
import { Roles } from "./roles-auth.decorator";
import { RolesGuard } from "./roles.guard";
import { RolesService } from "./roles.service";
import { Strategies } from "@app/auth/strategies.enum";
import { UpdateRoleDto } from "./dto/update-role.dto";
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

@Controller("roles")
@Roles(RoleName.Admin)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Roles")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create role" })
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created role",
        type: RoleViewModel,
    })
    @CommonApiResponseConflict()
    create(@Body() dto: CreateRoleDto, @GetUser() user: User): Promise<RoleViewModel> {
        return this.roleService.createRole(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get roles" })
    @OpenApiPaginationResponse(RoleViewModel, "Get roles")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>> {
        return this.roleService.getRoles(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get role" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get role",
        type: RoleViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<RoleViewModel> {
        return this.roleService.getRole(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update role" })
    @ApiBody({ type: UpdateRoleDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated role",
        type: RoleViewModel,
    })
    @CommonApiResponseConflict()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
        @GetUser() user: User,
    ): Promise<RoleViewModel> {
        return this.roleService.updateRole(id, updateRoleDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete role" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Delete role",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.roleService.deleteRole(id);
    }
}

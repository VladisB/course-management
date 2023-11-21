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
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupsService } from "./groups.service";
import { GroupViewModel } from "./view-models";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Strategies } from "@app/auth/strategies.enum";
import { RoleName } from "@common/enum";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("groups")
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Groups")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class GroupsController {
    constructor(private groupsService: GroupsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Create group" })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created group",
        type: GroupViewModel,
    })
    @CommonApiResponseConflict()
    create(@Body() dto: CreateGroupDto, @GetUser() user: User): Promise<GroupViewModel> {
        return this.groupsService.createGroup(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    @ApiOperation({ summary: "Get groups" })
    @OpenApiPaginationResponse(GroupViewModel, "Groups list")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>> {
        return this.groupsService.getGroups(queryParams);
    }

    @Get(":id")
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get group" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get group",
        type: GroupViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<GroupViewModel> {
        return this.groupsService.getGroup(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Update group" })
    @ApiBody({ type: UpdateGroupDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated group",
        type: GroupViewModel,
    })
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGroupDto: UpdateGroupDto,
        @GetUser() user: User,
    ): Promise<GroupViewModel> {
        return this.groupsService.updateGroup(id, updateGroupDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Delete group" })
    @CommonApiResponseNotFound()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Deleted group",
    })
    remove(@Param("id") id: number): Promise<void> {
        return this.groupsService.deleteGroup(id);
    }
}

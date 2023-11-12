import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("groups")
export class GroupsController {
    constructor(private groupsService: GroupsService) {}

    @Post()
    @HttpCode(201)
    @Roles(RoleName.Admin)
    create(@Body() dto: CreateGroupDto, @GetUser() user: User): Promise<GroupViewModel> {
        return this.groupsService.createGroup(dto, user);
    }

    @Get()
    @HttpCode(200)
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>> {
        return this.groupsService.getGroups(queryParams);
    }

    @Get(":id")
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<GroupViewModel> {
        return this.groupsService.getGroup(id);
    }

    @Patch(":id")
    @HttpCode(200)
    @Roles(RoleName.Admin)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGroupDto: UpdateGroupDto,
        @GetUser() user: User,
    ): Promise<GroupViewModel> {
        return this.groupsService.updateGroup(id, updateGroupDto, user);
    }

    @Delete(":id")
    @HttpCode(204)
    @Roles(RoleName.Admin)
    remove(@Param("id") id: number): Promise<void> {
        return this.groupsService.deleteGroup(id);
    }
}

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
import { RoleName } from "../roles/roles.enum";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupsService } from "./groups.service";
import { GroupViewModel } from "./view-models";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Strategies } from "src/auth/strategies.enum";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("groups")
export class GroupsController {
    constructor(private groupsService: GroupsService) {}

    @Post()
    create(@Body() dto: CreateGroupDto): Promise<GroupViewModel> {
        return this.groupsService.createGroup(dto);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>> {
        return this.groupsService.getGroups(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<GroupViewModel> {
        return this.groupsService.getGroup(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGroupDto: UpdateGroupDto,
    ): Promise<GroupViewModel> {
        return this.groupsService.updateGroup(id, updateGroupDto);
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.groupsService.deleteGroup(id);
    }
}

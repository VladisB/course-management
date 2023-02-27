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
import { AuthGuard } from "@nestjs/passport";
import { RoleName } from "../roles/roles.enum";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateGroupDto } from "./dto/create-group.dto";
import { GroupsService } from "./groups.service";
import { GroupViewModel } from "./view-models";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
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
    findOne(@Param("id") id: number) {
        throw new Error("Method not implemented.");
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() updateGroupDto: any) {
        throw new Error("Method not implemented.");
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        throw new Error("Method not implemented.");
    }
}

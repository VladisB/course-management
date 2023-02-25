import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
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

@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("groups")
export class GroupsController {
    constructor(private groupsService: GroupsService) {}

    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() dto: CreateGroupDto) {
        return this.groupsService.createGroup(dto);
    }

    @Get()
    getGroups() {
        return this.groupsService.getGroups();
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

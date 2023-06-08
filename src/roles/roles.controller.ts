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
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Roles } from "./roles-auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./roles.guard";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { RoleViewModel } from "./view-models";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Strategies } from "src/auth/strategies.enum";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { RoleName } from "src/common/enum";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("roles")
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto, @GetUser() user: User): Promise<RoleViewModel> {
        return this.roleService.createRole(dto, user);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>> {
        return this.roleService.getRoles(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<RoleViewModel> {
        return this.roleService.getRole(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
        @GetUser() user: User,
    ): Promise<RoleViewModel> {
        return this.roleService.updateRole(id, updateRoleDto, user);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.roleService.deleteRole(id);
    }
}

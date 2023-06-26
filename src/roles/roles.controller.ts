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

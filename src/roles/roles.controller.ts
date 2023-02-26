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
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Roles } from "./roles-auth.decorator";
import { RoleName } from "./roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./roles.guard";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { RoleViewModel } from "./view-models";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("roles")
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<RoleViewModel>> {
        return this.roleService.getRoles(queryParams);
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        throw new Error("Method not implemented.");
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() updateRoleDto: any) {
        throw new Error("Method not implemented.");
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        throw new Error("Method not implemented.");
    }
}

import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Roles } from "./roles-auth.decorator";
import { Role } from "./roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./roles.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard(), RolesGuard)
@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Roles } from './roles-auth.decorator';
import { RolesGuard } from './roles.guard';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/assign')
  assign(@Body() dto: AssignRoleDto) {
    return this.roleService.assignRole(dto);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }
}

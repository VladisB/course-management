import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "src/roles/roles-auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "src/roles/roles.enum";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { RolesGuard } from "src/roles/roles.guard";

@Controller("users")
@Roles(Role.Admin)
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Patch(":id")
  updateUser(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}

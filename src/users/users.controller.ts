import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "src/roles/roles-auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { Role } from "src/roles/roles.enum";

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
}

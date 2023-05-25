import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { HomeWorksService } from "./homeworks.service";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { UpdateHomeworkDto } from "./dto/update-homework.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { RoleName } from "src/roles/roles.enum";
import { Roles } from "src/roles/roles-auth.decorator";
import { RolesGuard } from "src/roles/roles.guard";
import { Strategies } from "src/auth/strategies.enum";
import { AuthGuard } from "@nestjs/passport";

@Roles(RoleName.Student)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@Controller("homeworks")
export class HomeWorksController {
    constructor(private readonly homeWorksService: HomeWorksService) {}

    @Post()
    create(@GetUser() user: User, @Body() CreateHomeworkDto: CreateHomeworkDto): Promise<any> {
        return this.homeWorksService.createHomework(CreateHomeworkDto, user);
    }

    // @Get()
    // findAll() {
    //     return this.homeWorksService.findAll();
    // }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.homeWorksService.findOne(+id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() UpdateHomeworkDto: UpdateHomeworkDto) {
    //     return this.homeWorksService.update(+id, UpdateHomeworkDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.homeWorksService.remove(+id);
    // }
}

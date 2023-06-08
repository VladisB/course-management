import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ValidationPipe,
    UsePipes,
    ParseIntPipe,
    Query,
} from "@nestjs/common";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { Roles } from "src/roles/roles-auth.decorator";
import { RolesGuard } from "src/roles/roles.guard";
import { Strategies } from "src/auth/strategies.enum";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { HomeworkViewModel } from "./view-models";
import { FileValidationPipe } from "./pipes/file-validation.pipe";
import { HomeworksService } from "./homeworks.service";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { RoleName } from "src/common/enum";

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("homeworks")
export class HomeworksController {
    constructor(private readonly homeworksService: HomeworksService) {}

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    @Roles(RoleName.Student)
    create(
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @GetUser() user: User,
        @Body() createHomeworkDto: CreateHomeworkDto,
    ): Promise<HomeworkViewModel> {
        return this.homeworksService.createHomework(createHomeworkDto, file.buffer, user);
    }

    @Get()
    @Roles(RoleName.Admin, RoleName.Instructor)
    findAll(@Query() queryParams: QueryParamsDTO) {
        return this.homeworksService.getAllHomeworks(queryParams);
    }

    @Get("/my")
    @Roles(RoleName.Student)
    findMy(@GetUser() user: User, @Query() queryParams: QueryParamsDTO) {
        return this.homeworksService.getAllStudentHomeworks(queryParams, user);
    }

    @Get(":id")
    @Roles(RoleName.Student, RoleName.Admin, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<HomeworkViewModel> {
        return this.homeworksService.getHomework(id);
    }

    @Patch(":id")
    @Roles(RoleName.Student)
    @UseInterceptors(FileInterceptor("file"))
    update(
        @Param("id", ParseIntPipe) id: number,
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @GetUser() user: User,
    ): Promise<HomeworkViewModel> {
        return this.homeworksService.updateHomework(id, file.buffer, user);
    }

    @Delete(":id")
    @Roles(RoleName.Student, RoleName.Admin)
    remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User) {
        return this.homeworksService.deleteHomework(id, user);
    }
}

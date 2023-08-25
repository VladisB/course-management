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
import { AuthGuard } from "@nestjs/passport";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "./pipes/file-validation.pipe";
import { GetUser } from "@app/auth/get-user.decorator";
import { HomeworkViewModel } from "./view-models";
import { HomeworksService } from "./homeworks.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { RoleName } from "@common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RolesGuard } from "@app/roles/roles.guard";
import { Strategies } from "@app/auth/strategies.enum";
import { User } from "@app/users/entities/user.entity";
import { ThrottlerGuard } from "@nestjs/throttler";

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("homeworks")
export class HomeworksController {
    constructor(private readonly homeworksService: HomeworksService) {}

    @Post()
    @UseGuards(ThrottlerGuard)
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
    findMy(@Query() queryParams: QueryParamsDTO, @GetUser() user: User) {
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

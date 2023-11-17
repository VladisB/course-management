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
    HttpCode,
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
import { DataListResponse } from "@app/common/db/data-list-response";

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("homeworks")
export class HomeworksController {
    constructor(private readonly homeworksService: HomeworksService) {}

    @Post()
    @HttpCode(201)
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
    @HttpCode(200)
    @Roles(RoleName.Admin, RoleName.Instructor)
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<HomeworkViewModel>> {
        return this.homeworksService.getAllHomeworks(queryParams);
    }

    @Get("/my")
    @HttpCode(200)
    @Roles(RoleName.Student)
    findMy(
        @Query() queryParams: QueryParamsDTO,
        @GetUser() user: User,
    ): Promise<DataListResponse<HomeworkViewModel>> {
        return this.homeworksService.getAllStudentHomeworks(queryParams, user);
    }

    @Get(":id")
    @HttpCode(200)
    @Roles(RoleName.Student, RoleName.Admin, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<HomeworkViewModel> {
        return this.homeworksService.getHomework(id);
    }

    @Patch(":id")
    @HttpCode(200)
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
    @HttpCode(204)
    @Roles(RoleName.Student, RoleName.Admin)
    remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.homeworksService.deleteHomework(id, user);
    }
}

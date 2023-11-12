import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UsePipes,
    UseGuards,
    Query,
    ParseIntPipe,
    HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { GetUser } from "@app/auth/get-user.decorator";
import { LessonGradeViewModel } from "./view-models";
import { LessonGradesService } from "./lesson-grades.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { RoleName } from "@common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RolesGuard } from "@app/roles/roles.guard";
import { Strategies } from "@app/auth/strategies.enum";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";
import { User } from "@app/users/entities/user.entity";

@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("lesson-grades")
export class LessonGradesController {
    constructor(private readonly lessonGradesService: LessonGradesService) {}

    @Post()
    @HttpCode(201)
    create(
        @Body() createLessonGradeDto: CreateLessonGradeDto,
        @GetUser() user: User,
    ): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.createGrade(createLessonGradeDto, user);
    }

    @Get()
    @HttpCode(200)
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<LessonGradeViewModel>> {
        return this.lessonGradesService.getAllGrades(queryParams);
    }

    @Get(":id")
    @HttpCode(200)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.getGrade(id);
    }

    @Patch(":id")
    @HttpCode(200)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateLessonGradeDto: UpdateLessonGradeDto,
        @GetUser() user: User,
    ): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.updateGrade(id, updateLessonGradeDto, user);
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.lessonGradesService.deleteGrade(id);
    }
}

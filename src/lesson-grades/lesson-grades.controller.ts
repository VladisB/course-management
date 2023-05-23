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
} from "@nestjs/common";
import { LessonGradesService } from "./lesson-grades.service";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "src/auth/strategies.enum";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";
import { LessonGradeViewModel } from "./view-models";

// @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UseGuards(AuthGuard(Strategies.JWT))
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("lesson-grades")
export class LessonGradesController {
    constructor(private readonly lessonGradesService: LessonGradesService) {}

    @Post()
    create(@GetUser() user: User, @Body() createLessonGradeDto: CreateLessonGradeDto) {
        return this.lessonGradesService.createGrade(createLessonGradeDto, user);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<LessonGradeViewModel>> {
        return this.lessonGradesService.getAllGrades(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.getGrade(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body() updateLessonGradeDto: UpdateLessonGradeDto,
    ) {
        return this.lessonGradesService.updateGrade(id, updateLessonGradeDto, user);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.lessonGradesService.deleteGrade(id);
    }
}

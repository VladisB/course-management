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
} from "@nestjs/common";
import { LessonGradesService } from "./lesson-grades.service";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "src/auth/strategies.enum";

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

    // @Get()
    // findAll() {
    //     return this.lessonGradesService.getAllGrades();
    // }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.lessonGradesService.getGrade(+id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateLessonGradeDto: UpdateLessonGradeDto) {
    //     return this.lessonGradesService.updateGrade(+id, updateLessonGradeDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.lessonGradesService.deleteGrade(+id);
    // }
}

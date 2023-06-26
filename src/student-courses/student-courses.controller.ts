import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../roles/roles.guard";
import { DataListResponse } from "@common/db/data-list-response";
import { Strategies } from "@app/auth/strategies.enum";
import { CreateStudentCoursesDto } from "./dto/create-student-courses.dto";
import { UpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { StudentCoursesService } from "./student-courses.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { StudentCoursesViewModel } from "./view-models";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RoleName } from "@common/enum";

@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("student-courses")
export class StudentCoursesController {
    constructor(private studentCoursesService: StudentCoursesService) {}

    // NOTE: Probably won't be used. The student-courses are created automatically when the student will be added to a Group.
    @Post()
    create(@Body() dto: CreateStudentCoursesDto): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.createStudentCourse(dto);
    }

    @Get()
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentCoursesViewModel>> {
        return this.studentCoursesService.getStudentCourses(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentCoursesViewModel> {
        console.log("id", id);
        return this.studentCoursesService.getStudentCourse(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateStudentCoursesDto,
    ): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.updateStudentCourse(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.studentCoursesService.deleteUpdateStudentCourse(id);
    }
}

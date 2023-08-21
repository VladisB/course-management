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
import { PATCHUpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { StudentCoursesService } from "./student-courses.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { StudentCoursesViewModel } from "./view-models";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RoleName } from "@common/enum";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";

@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("student-courses")
export class StudentCoursesController {
    constructor(private studentCoursesService: StudentCoursesService) {}

    @Post()
    create(
        @Body() dto: CreateStudentCoursesDto,
        @GetUser() user: User,
    ): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.createStudentCourse(dto, user);
    }

    @Get()
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentCoursesViewModel>> {
        return this.studentCoursesService.getStudentCourses(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.getStudentCourse(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: PATCHUpdateStudentCoursesDto,
        @GetUser() user: User,
    ): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.updateStudentCourse(id, dto, user);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.studentCoursesService.deleteStudentCourse(id);
    }
}

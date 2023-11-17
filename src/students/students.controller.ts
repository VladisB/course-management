import {
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { IStudentsService } from "./students.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import {
    StudentCourseViewModel,
    StudentDetailsViewModel,
    StudentListViewModel,
} from "./view-models";
import { DataListResponse } from "@common/db/data-list-response";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "@app/auth/strategies.enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RolesGuard } from "@app/roles/roles.guard";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";
import { RoleName } from "@common/enum";

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@Controller("students")
export class StudentsController {
    constructor(private readonly studentsService: IStudentsService) {}

    @Get()
    @HttpCode(200)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<StudentListViewModel>> {
        return this.studentsService.getAllStudents(queryParams);
    }

    @Get("/my-courses")
    @HttpCode(200)
    @Roles(RoleName.Student)
    findStudentCourses(@GetUser() user: User): Promise<StudentCourseViewModel[]> {
        return this.studentsService.getStudentCourses(user.id);
    }

    @Get(":id")
    @HttpCode(200)
    @Roles(RoleName.Admin, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentDetailsViewModel> {
        return this.studentsService.getStudent(id);
    }
}

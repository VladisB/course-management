import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";

@Controller("students")
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@ApiTags("Students")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class StudentsController {
    constructor(private readonly studentsService: IStudentsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: "Get all students" })
    @OpenApiPaginationResponse(StudentListViewModel, "Get all students") //TODO: Investigate why this is not working but with StudentCourseViewModel is working
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<StudentListViewModel>> {
        return this.studentsService.getAllStudents(queryParams);
    }

    @Get("/my-courses")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Student)
    @ApiOperation({ summary: "Get student courses" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Student courses",
        type: [StudentCourseViewModel],
    })
    findStudentCourses(@GetUser() user: User): Promise<StudentCourseViewModel[]> {
        return this.studentsService.getStudentCourses(user.id);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get student details" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Student details",
        type: StudentDetailsViewModel,
    })
    @CommonApiResponseNotFound()
    @Roles(RoleName.Admin, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentDetailsViewModel> {
        return this.studentsService.getStudent(id);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";

@Controller("student-courses")
@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Student Courses")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class StudentCoursesController {
    constructor(private studentCoursesService: StudentCoursesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create student course" })
    @ApiBody({ type: CreateStudentCoursesDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created student course",
        type: StudentCoursesViewModel,
    })
    @CommonApiResponseConflict()
    create(
        @Body() dto: CreateStudentCoursesDto,
        @GetUser() user: User,
    ): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.createStudentCourse(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get student courses" })
    @OpenApiPaginationResponse(StudentCoursesViewModel, "Get student courses")
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentCoursesViewModel>> {
        return this.studentCoursesService.getStudentCourses(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get student course" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get student course",
        type: StudentCoursesViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.getStudentCourse(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update student course" })
    @ApiBody({ type: PATCHUpdateStudentCoursesDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated student course",
        type: StudentCoursesViewModel,
    })
    @CommonApiResponseConflict()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: PATCHUpdateStudentCoursesDto,
        @GetUser() user: User,
    ): Promise<StudentCoursesViewModel> {
        return this.studentCoursesService.updateStudentCourse(id, dto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete student course" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Delete student course",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.studentCoursesService.deleteStudentCourse(id);
    }
}

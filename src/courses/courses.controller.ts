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
import { CreateCourseDto } from "./dto/create-course.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CoursesService } from "./courses.service";
import { CourseViewModel } from "./view-models";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";
import { RoleName } from "@app/common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { Strategies } from "@app/auth/strategies.enum";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";

@Controller("courses")
@UseGuards(AuthGuard(Strategies.JWT))
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Courses")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Create course" })
    @ApiBody({ type: CreateCourseDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created course",
        type: CourseViewModel,
    })
    @CommonApiResponseConflict()
    create(@Body() dto: CreateCourseDto, @GetUser() user: User): Promise<CourseViewModel> {
        return this.coursesService.createCourse(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get courses" })
    @OpenApiPaginationResponse(CourseViewModel, "Get courses")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>> {
        return this.coursesService.getCourses(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get course" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get course",
        type: CourseViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CourseViewModel> {
        return this.coursesService.getCourse(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Update course" })
    @ApiBody({ type: UpdateCourseDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated course",
        type: CourseViewModel,
    })
    @CommonApiResponseNotFound()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateCourseDto,
        @GetUser() user: User,
    ): Promise<CourseViewModel> {
        return this.coursesService.updateCourse(id, updateFacultyDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Delete course" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Delete course",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.coursesService.deleteCourse(id);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { PUTUpdateCourseInstructorsDto } from "./dto/put-update-course-instructors.dto";
import { CourseInstructorsService } from "./course-instructors.service";
import {
    CourseInstructorViewModel,
    CourseInstructorsListViewModel,
    CourseInstructorsViewModel,
} from "./view-models";
import { CreateCourseInstructorsDto } from "./dto/create-course-instructors.dto";
import { User } from "@app/users/entities/user.entity";
import { GetUser } from "@app/auth/get-user.decorator";
import { RolesGuard } from "@app/roles/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "@app/auth/strategies.enum";
import { RoleName } from "@app/common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
} from "@app/common/swagger/common-api-responses-swagger";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("course-instructors")
@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Course Instructors")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class CourseInstructorsController {
    constructor(private courseInstructorsService: CourseInstructorsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create course instructors" })
    @ApiBody({ type: CreateCourseInstructorsDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: CourseInstructorsViewModel,
        description: "Create course instructors successful",
    })
    @CommonApiResponseConflict()
    create(
        @Body() dto: CreateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.createCourseInstructors(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get course instructors" })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DataListResponse<CourseInstructorsListViewModel>,
        description: "Get course instructors successful",
    })
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsListViewModel>> {
        return this.courseInstructorsService.getCourseInstructors(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get course instructor" })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseInstructorViewModel,
        description: "Get course instructor successful",
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CourseInstructorViewModel> {
        return this.courseInstructorsService.getCourseInstructor(id);
    }

    @Put(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update course instructor" })
    @ApiBody({ type: PUTUpdateCourseInstructorsDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CourseInstructorsViewModel,
        description: "Update course instructor successful",
    })
    @CommonApiResponseNotFound()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: PUTUpdateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.updateCourseInstructors(id, dto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete course instructor" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Course instructor deleted successful (No content)",
    })
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.courseInstructorsService.deleteCourseInstructors(id);
    }
}

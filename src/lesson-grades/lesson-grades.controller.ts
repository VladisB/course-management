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
    HttpStatus,
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
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("lesson-grades")
@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Lesson Grades")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class LessonGradesController {
    constructor(private readonly lessonGradesService: LessonGradesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "Create lesson grade" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created lesson grade",
        type: LessonGradeViewModel,
    })
    @ApiBody({ type: CreateLessonGradeDto })
    @CommonApiResponseConflict()
    create(
        @Body() createLessonGradeDto: CreateLessonGradeDto,
        @GetUser() user: User,
    ): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.createGrade(createLessonGradeDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @OpenApiPaginationResponse(LessonGradeViewModel, "List of lesson grades")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<LessonGradeViewModel>> {
        return this.lessonGradesService.getAllGrades(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get lesson grade" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Lesson grade",
        type: LessonGradeViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.getGrade(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Update lesson grade" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated lesson grade",
        type: LessonGradeViewModel,
    })
    @ApiBody({ type: UpdateLessonGradeDto })
    @CommonApiResponseConflict()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateLessonGradeDto: UpdateLessonGradeDto,
        @GetUser() user: User,
    ): Promise<LessonGradeViewModel> {
        return this.lessonGradesService.updateGrade(id, updateLessonGradeDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete lesson grade" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Deleted lesson grade",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.lessonGradesService.deleteGrade(id);
    }
}

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
    Query,
    ParseIntPipe,
    UseGuards,
    ForbiddenException,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonViewModel, StudentLessonListViewModel } from "./view-models";
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { Strategies } from "@app/auth/strategies.enum";
import { RolesGuard } from "@app/roles/roles.guard";
import { Roles } from "@app/roles/roles-auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@app/users/entities/user.entity";
import { GetUser } from "@app/auth/get-user.decorator";
import { RoleName } from "@common/enum";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";

@Controller("lessons")
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@ApiTags("Lessons")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Create lesson" })
    @ApiBody({ type: CreateLessonDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created lesson",
        type: LessonViewModel,
    })
    @CommonApiResponseConflict()
    create(
        @Body() createLessonDto: CreateLessonDto,
        @GetUser() user: User,
    ): Promise<LessonViewModel> {
        return this.lessonsService.createLesson(createLessonDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Get lessons" })
    @OpenApiPaginationResponse(LessonViewModel, "Get lessons")
    async findAll(
        @GetUser() user: User,
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<LessonViewModel>> {
        const { role } = user;
        let result: DataListResponse<LessonViewModel> = null;

        switch (role.name) {
            case RoleName.Admin:
                result = await this.lessonsService.getLessons(queryParams);
                break;
            case RoleName.Instructor:
                result = await this.lessonsService.getInstructorLessons(queryParams, user.id);
                break;
            default:
                throw new ForbiddenException();
        }

        return result;
    }

    @Get("/my")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Student)
    @ApiOperation({ summary: "Get student lessons" })
    @OpenApiPaginationResponse(StudentLessonListViewModel, "Get student lessons")
    async findStudentLessons(
        @GetUser() user: User,
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentLessonListViewModel>> {
        return await this.lessonsService.getStudentLessons(queryParams, user.id);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Instructor, RoleName.Student)
    @ApiOperation({ summary: "Get lesson" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get lesson",
        type: LessonViewModel,
    })
    @CommonApiResponseNotFound()
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonViewModel> {
        return this.lessonsService.getLesson(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Update lesson" })
    @ApiBody({ type: UpdateLessonDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated lesson",
        type: LessonViewModel,
    })
    @CommonApiResponseNotFound()
    @CommonApiResponseConflict()
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateLessonDto: UpdateLessonDto,
        @GetUser() user: User,
    ): Promise<LessonViewModel> {
        return this.lessonsService.updateLesson(id, updateLessonDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Delete lesson" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Delete lesson",
    })
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.lessonsService.deleteLesson(id);
    }
}

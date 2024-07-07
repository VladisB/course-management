import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ValidationPipe,
    UsePipes,
    ParseIntPipe,
    Query,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "./pipes/file-validation.pipe";
import { GetUser } from "@app/auth/get-user.decorator";
import { HomeworkViewModel } from "./view-models";
import { HomeworksService } from "./homeworks.service";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { RoleName } from "@common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { RolesGuard } from "@app/roles/roles.guard";
import { Strategies } from "@app/auth/strategies.enum";
import { User } from "@app/users/entities/user.entity";
import { ThrottlerGuard } from "@nestjs/throttler";
import { DataListResponse } from "@app/common/db/data-list-response";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import {
    CommonApiResponseBadRequest,
    CommonApiResponseConflict,
    CommonApiResponseInternalServerError,
    CommonApiResponseForbidden,
    CommonApiResponseNotFound,
    OpenApiPaginationResponse,
} from "@app/common/swagger/common-api-responses-swagger";

@Controller("homeworks")
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Homeworks")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class HomeworksController {
    constructor(private readonly homeworksService: HomeworksService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(ThrottlerGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Roles(RoleName.Student)
    @ApiOperation({ summary: "Create homework" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created homework",
        type: HomeworkViewModel,
    })
    @CommonApiResponseConflict()
    @ApiConsumes("multipart/form-data")
        // TODO: Move outside of controller
    @ApiBody({
        description: "Homework creation data",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "File to be uploaded",
                },
                lessonId: {
                    type: "integer",
                    description: "ID of the lesson",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created homework",
        type: HomeworkViewModel,
    })
    create(
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @GetUser() user: User,
        @Body() createHomeworkDto: CreateHomeworkDto,
    ): Promise<HomeworkViewModel> {
        return this.homeworksService.createHomework(createHomeworkDto, file.buffer, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Get homeworks" })
    @OpenApiPaginationResponse(HomeworkViewModel, "Get homeworks")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<HomeworkViewModel>> {
        return this.homeworksService.getAllHomeworks(queryParams);
    }

    @Get("/my")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Student)
    @ApiOperation({ summary: "Get my homeworks" })
    @OpenApiPaginationResponse(HomeworkViewModel, "Get my homeworks")
    findMy(
        @Query() queryParams: QueryParamsDTO,
        @GetUser() user: User,
    ): Promise<DataListResponse<HomeworkViewModel>> {
        return this.homeworksService.getAllStudentHomeworks(queryParams, user);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Student, RoleName.Admin, RoleName.Instructor)
    @ApiOperation({ summary: "Get homework" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get homework",
        type: HomeworkViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<HomeworkViewModel> {
        return this.homeworksService.getHomework(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Student, RoleName.Admin)
    @ApiOperation({ summary: "Update homework" })
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        description: "Homework update data",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "File to be uploaded",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated homework",
        type: HomeworkViewModel,
    })
    update(
        @Param("id", ParseIntPipe) id: number,
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @GetUser() user: User,
    ): Promise<HomeworkViewModel> {
        return this.homeworksService.updateHomework(id, file.buffer, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(RoleName.Student, RoleName.Admin)
    @ApiOperation({ summary: "Delete homework" })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Delete homework",
    })
    @CommonApiResponseNotFound()
    remove(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.homeworksService.deleteHomework(id, user);
    }
}

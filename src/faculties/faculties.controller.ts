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
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesService } from "./faculties.service";
import { FacultyViewModel } from "./view-models";
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { Strategies } from "@app/auth/strategies.enum";
import { RoleName } from "@common/enum";
import { RolesGuard } from "@app/roles/roles.guard";
import { Roles } from "@app/roles/roles-auth.decorator";
import { GetUser } from "@app/auth/get-user.decorator";
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

@Controller("faculties")
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("Faculties")
@CommonApiResponseBadRequest()
@CommonApiResponseInternalServerError()
@CommonApiResponseForbidden()
@ApiBearerAuth("JWT-auth")
export class FacultiesController {
    constructor(private facultyService: FacultiesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Create faculty" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Created faculty",
        type: FacultyViewModel,
    })
    @CommonApiResponseConflict()
    create(@Body() dto: CreateFacultyDto, @GetUser() user: User): Promise<FacultyViewModel> {
        return this.facultyService.createFaculty(dto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    @ApiOperation({ summary: "Get faculties" })
    @OpenApiPaginationResponse(FacultyViewModel, "Faculties list")
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>> {
        return this.facultyService.getFaculties(queryParams);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    @ApiOperation({ summary: "Get faculty" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Faculty",
        type: FacultyViewModel,
    })
    @CommonApiResponseNotFound()
    findOne(@Param("id", ParseIntPipe) id: number): Promise<FacultyViewModel> {
        return this.facultyService.getFaculty(id);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Update faculty" })
    @ApiBody({ type: UpdateFacultyDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Updated faculty",
        type: FacultyViewModel,
    })
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateFacultyDto,
        @GetUser() user: User,
    ): Promise<FacultyViewModel> {
        return this.facultyService.updateFaculty(id, updateFacultyDto, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(RoleName.Admin)
    @ApiOperation({ summary: "Delete faculty" })
    @CommonApiResponseNotFound()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Delete faculty",
    })
    remove(@Param("id") id: number): Promise<void> {
        return this.facultyService.deleteFaculty(id);
    }
}

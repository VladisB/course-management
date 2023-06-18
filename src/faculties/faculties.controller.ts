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

@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("faculties")
export class FacultiesController {
    constructor(private facultyService: FacultiesService) {}

    @Post()
    @Roles(RoleName.Admin)
    create(@Body() dto: CreateFacultyDto): Promise<FacultyViewModel> {
        return this.facultyService.createFaculty(dto);
    }

    @Get()
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>> {
        return this.facultyService.getFaculties(queryParams);
    }

    @Get(":id")
    @Roles(RoleName.Admin, RoleName.Student, RoleName.Instructor)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<FacultyViewModel> {
        return this.facultyService.getFaculty(id);
    }

    @Patch(":id")
    @Roles(RoleName.Admin)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateFacultyDto,
    ): Promise<FacultyViewModel> {
        return this.facultyService.updateFaculty(id, updateFacultyDto);
    }

    @Delete(":id")
    @Roles(RoleName.Admin)
    remove(@Param("id") id: number): Promise<void> {
        return this.facultyService.deleteFaculty(id);
    }
}

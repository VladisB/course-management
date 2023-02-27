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
import { RoleName } from "../roles/roles.enum";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesService } from "./faculties.service";
import { FacultyViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("faculties")
export class FacultiesController {
    constructor(private facultyService: FacultiesService) {}

    @Post()
    create(@Body() dto: CreateFacultyDto): Promise<FacultyViewModel> {
        return this.facultyService.createFaculty(dto);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>> {
        return this.facultyService.getFaculties(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<FacultyViewModel> {
        return this.facultyService.getFaculty(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateFacultyDto,
    ): Promise<FacultyViewModel> {
        return this.facultyService.updateFaculty(id, updateFacultyDto);
    }

    @Delete(":id")
    remove(@Param("id") id: number): Promise<void> {
        return this.facultyService.deleteFaculty(id);
    }
}

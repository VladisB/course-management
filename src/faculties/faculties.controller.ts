import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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
    findOne(@Param("id") id: number) {
        throw new Error("Not implemented");
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() updateFacultyDto: any) {
        throw new Error("Method not implemented");
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        throw new Error("Method not implemented");
    }
}

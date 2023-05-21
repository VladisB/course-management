import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { IStudentsService } from "./students.service";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { StudentDetailsViewModel, StudentListViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { RoleName } from "src/roles/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "src/auth/strategies.enum";
import { Roles } from "src/roles/roles-auth.decorator";
import { RolesGuard } from "src/roles/roles.guard";

@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@Controller("students")
export class StudentsController {
    constructor(private readonly studentsService: IStudentsService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<StudentListViewModel>> {
        return this.studentsService.getAllStudents(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<StudentDetailsViewModel> {
        return this.studentsService.getStudent(id);
    }
}

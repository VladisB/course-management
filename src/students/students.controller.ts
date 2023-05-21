import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { IStudentsService } from "./students.service";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { StudentDetailsViewModel, StudentListViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";

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

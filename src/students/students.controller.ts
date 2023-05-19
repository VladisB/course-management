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

@Controller("students")
export class StudentsController {
    constructor(private readonly studentsService: IStudentsService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    findAll(@Query() queryParams: QueryParamsDTO) {
        return this.studentsService.getAllStudents(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.studentsService.getStudent(id);
    }
}

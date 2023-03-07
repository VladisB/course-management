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
import { RolesGuard } from "../roles/roles.guard";
import { CreateCourseDto } from "./dto/create-course.dto";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { Strategies } from "src/auth/strategies.enum";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CoursesService } from "./courses.service";
import { CourseViewModel } from "./view-models";

// @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("courses")
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Post()
    create(@Body() dto: CreateCourseDto): Promise<CourseViewModel> {
        return this.coursesService.createCourse(dto);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>> {
        return this.coursesService.getCourses(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CourseViewModel> {
        return this.coursesService.getCourse(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateCourseDto,
    ): Promise<CourseViewModel> {
        return this.coursesService.updateCourse(id, updateFacultyDto);
    }

    @Delete(":id")
    remove(@Param("id") id: number): Promise<void> {
        return this.coursesService.deleteCourse(id);
    }
}

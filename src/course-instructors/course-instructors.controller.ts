import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { PUTUpdateCourseDto } from "./dto/put-update-course-instructors.dto";
import { CourseInstructorsService } from "./course-instructors.service";
import {
    CourseInstructorViewModel,
    CourseInstructorsListViewModel,
    CourseInstructorsViewModel,
} from "./view-models";
import { CreateCourseInstructorsDto } from "./dto/create-course-instructors.dto";

// @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("course-instructors")
export class CoursesController {
    constructor(private courseInstructorsService: CourseInstructorsService) {}

    @Post()
    create(@Body() dto: CreateCourseInstructorsDto): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.createCourseInstructors(dto);
    }

    @Get()
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsListViewModel>> {
        return this.courseInstructorsService.getCourseInstructors(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CourseInstructorViewModel> {
        return this.courseInstructorsService.getCourseInstructor(id);
    }

    @Put(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: PUTUpdateCourseDto,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.updateCourseInstructors(id, dto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.courseInstructorsService.deleteCourseInstructors(id);
    }
}

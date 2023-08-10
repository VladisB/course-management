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
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { PUTUpdateCourseInstructorsDto } from "./dto/put-update-course-instructors.dto";
import { CourseInstructorsService } from "./course-instructors.service";
import {
    CourseInstructorViewModel,
    CourseInstructorsListViewModel,
    CourseInstructorsViewModel,
} from "./view-models";
import { CreateCourseInstructorsDto } from "./dto/create-course-instructors.dto";
import { User } from "@app/users/entities/user.entity";
import { GetUser } from "@app/auth/get-user.decorator";

// @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("course-instructors")
export class CourseInstructorsController {
    constructor(private courseInstructorsService: CourseInstructorsService) {}

    @Post()
    create(
        @Body() dto: CreateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.createCourseInstructors(dto, user);
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
        @Body() dto: PUTUpdateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.updateCourseInstructors(id, dto, user);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.courseInstructorsService.deleteCourseInstructors(id);
    }
}

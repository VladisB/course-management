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
import { DataListResponse } from "@common/db/data-list-response";
import { QueryParamsDTO } from "@common/dto/query-params.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CoursesService } from "./courses.service";
import { CourseViewModel } from "./view-models";
import { GetUser } from "@app/auth/get-user.decorator";
import { User } from "@app/users/entities/user.entity";
import { RoleName } from "@app/common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";
import { Strategies } from "@app/auth/strategies.enum";

@UseGuards(AuthGuard(Strategies.JWT))
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("courses")
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Post()
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    create(@Body() dto: CreateCourseDto, @GetUser() user: User): Promise<CourseViewModel> {
        return this.coursesService.createCourse(dto, user);
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
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateFacultyDto: UpdateCourseDto,
        @GetUser() user: User,
    ): Promise<CourseViewModel> {
        return this.coursesService.updateCourse(id, updateFacultyDto, user);
    }

    @Delete(":id")
    @UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
    @Roles(RoleName.Admin, RoleName.Instructor)
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.coursesService.deleteCourse(id);
    }
}

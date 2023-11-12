import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
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
import { RolesGuard } from "@app/roles/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { Strategies } from "@app/auth/strategies.enum";
import { RoleName } from "@app/common/enum";
import { Roles } from "@app/roles/roles-auth.decorator";

@Roles(RoleName.Admin, RoleName.Instructor)
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller("course-instructors")
export class CourseInstructorsController {
    constructor(private courseInstructorsService: CourseInstructorsService) {}

    @Post()
    @HttpCode(201)
    create(
        @Body() dto: CreateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.createCourseInstructors(dto, user);
    }

    @Get()
    @HttpCode(200)
    findAll(
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsListViewModel>> {
        return this.courseInstructorsService.getCourseInstructors(queryParams);
    }

    @Get(":id")
    @HttpCode(200)
    findOne(@Param("id", ParseIntPipe) id: number): Promise<CourseInstructorViewModel> {
        return this.courseInstructorsService.getCourseInstructor(id);
    }

    @Put(":id")
    @HttpCode(200)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: PUTUpdateCourseInstructorsDto,
        @GetUser() user: User,
    ): Promise<CourseInstructorsViewModel> {
        return this.courseInstructorsService.updateCourseInstructors(id, dto, user);
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.courseInstructorsService.deleteCourseInstructors(id);
    }
}

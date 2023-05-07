import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UsePipes,
    Query,
    ParseIntPipe,
    UseGuards,
    ForbiddenException,
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { RoleName } from "src/roles/roles.enum";
import { Strategies } from "src/auth/strategies.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { Roles } from "src/roles/roles-auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";
import { GetUser } from "src/auth/get-user.decorator";

@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(AuthGuard(Strategies.JWT), RolesGuard)
@Controller("lessons")
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    @Roles(RoleName.Admin, RoleName.Instructor)
    create(@Body() createLessonDto: CreateLessonDto): Promise<LessonViewModel> {
        return this.lessonsService.createLesson(createLessonDto);
    }

    @Get()
    @Roles(RoleName.Admin, RoleName.Instructor, RoleName.Student)
    async findAll(
        @GetUser() user: User,
        @Query() queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<LessonViewModel>> {
        const { role } = user;
        let result: DataListResponse<LessonViewModel> = null;

        switch (role.name) {
            case RoleName.Admin:
                result = await this.lessonsService.getLessons(queryParams);
                break;
            case RoleName.Instructor:
                result = await this.lessonsService.getInstructorLessons(queryParams, user.id);
                break;
            case RoleName.Student:
                result = await this.lessonsService.getStudentLessons(queryParams, user.id);
                break;
            default:
                throw new ForbiddenException();
        }

        return result;
    }

    // NOTE: It's not nessaary, but here I may need to add some kind of filter to get only lessons that are related to the user
    @Get(":id")
    @Roles(RoleName.Admin, RoleName.Instructor, RoleName.Student)
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonViewModel> {
        return this.lessonsService.getLesson(id);
    }

    @Patch(":id")
    @Roles(RoleName.Admin, RoleName.Instructor)
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateLessonDto: UpdateLessonDto,
    ): Promise<LessonViewModel> {
        return this.lessonsService.updateLesson(id, updateLessonDto);
    }

    @Delete(":id")
    @Roles(RoleName.Admin, RoleName.Instructor)
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.lessonsService.deleteLesson(id);
    }
}

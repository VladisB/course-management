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
} from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";

@UsePipes(new ValidationPipe({ transform: true }))
@Controller("lessons")
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.createLesson(createLessonDto);
    }

    @Get()
    findAll(@Query() queryParams: QueryParamsDTO): Promise<DataListResponse<LessonViewModel>> {
        return this.lessonsService.getLessons(queryParams);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<LessonViewModel> {
        return this.lessonsService.getLesson(id);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.updateLesson(id, updateLessonDto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: string) {
        return this.lessonsService.deleteLesson(+id);
    }
}

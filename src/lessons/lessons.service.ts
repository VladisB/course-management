import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { CoursesRepository } from "src/courses/courses.repository";
import { Course } from "src/courses/entities/course.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonsRepository } from "./lessons.repository";
import { LessonsViewModelFactory } from "./model-factories";
import { LessonViewModel } from "./view-models";

@Injectable()
export class LessonsService implements ILessonsService {
    constructor(
        private readonly lessonsRepository: LessonsRepository,
        private readonly coursesRepository: CoursesRepository,
        private readonly lessonsViewModelFactory: LessonsViewModelFactory,
    ) {}

    public async createLesson(dto: CreateLessonDto): Promise<LessonViewModel> {
        const course = await this.validateCreate(dto);

        const lesson = await this.lessonsRepository.create(dto, course);

        return this.lessonsViewModelFactory.initLessonViewModel(lesson);
    }
    deleteLesson(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getLesson(id: number): Promise<LessonViewModel> {
        throw new Error("Method not implemented.");
    }
    getLessons(queryParams: QueryParamsDTO): Promise<DataListResponse<LessonViewModel>> {
        throw new Error("Method not implemented.");
    }
    updateLesson(id: number, dto: UpdateLessonDto): Promise<LessonViewModel> {
        throw new Error("Method not implemented.");
    }

    private async validateCreate(dto: CreateLessonDto): Promise<Course> {
        await this.checkIfExistsByTheme(dto.theme);
        return await this.checkIfCourseExists(dto.courseId);
    }

    private async checkIfCourseExists(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) {
            throw new NotFoundException();
        }

        return course;
    }

    private async checkIfExistsByTheme(theme: string): Promise<void> {
        const lesson = await this.lessonsRepository.getByTheme(theme);

        if (lesson) {
            throw new ConflictException("Lesson with this theme already exists");
        }
    }
}

interface ILessonsService {
    createLesson(dto: CreateLessonDto): Promise<LessonViewModel>;
    deleteLesson(id: number): Promise<void>;
    getLesson(id: number): Promise<LessonViewModel>;
    getLessons(queryParams: QueryParamsDTO): Promise<DataListResponse<LessonViewModel>>;
    updateLesson(id: number, dto: UpdateLessonDto): Promise<LessonViewModel>;
}

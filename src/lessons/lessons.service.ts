import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension, DatatablesConfig } from "@common/query-extention";
import { ICoursesRepository } from "src/courses/courses.repository";
import { Course } from "src/courses/entities/course.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { ILessonsRepository } from "./lessons.repository";
import { LessonsViewModelFactory } from "./model-factories";
import { LessonViewModel } from "./view-models";
import { BaseErrorMessage } from "@common/enum";

@Injectable()
export class LessonsService implements ILessonsService {
    constructor(
        private readonly lessonsRepository: ILessonsRepository,
        private readonly coursesRepository: ICoursesRepository,
        private readonly lessonsViewModelFactory: LessonsViewModelFactory,
    ) {}

    public async createLesson(dto: CreateLessonDto): Promise<LessonViewModel> {
        const course = await this.validateCreate(dto);

        const lesson = await this.lessonsRepository.create(dto, course);

        return this.lessonsViewModelFactory.initLessonViewModel(lesson);
    }

    public async deleteLesson(id: number): Promise<void> {
        await this.validateDelete(id);

        await this.lessonsRepository.deleteById(id);
    }

    public async getLesson(id: number): Promise<LessonViewModel> {
        const lesson = await this.lessonsRepository.getById(id);

        if (!lesson) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        return this.lessonsViewModelFactory.initLessonViewModel(lesson);
    }

    public async getLessons(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<LessonViewModel>> {
        const query = this.lessonsRepository.getAllQ();

        const config = this.getDatatablesConfig();

        const [lessons, count] = await ApplyToQueryExtension.applyToQuery<Lesson>(
            queryParams,
            query,
            config,
        );

        const model = this.lessonsViewModelFactory.initLessonListViewModel(lessons);

        return new DataListResponse<LessonViewModel>(model, count);
    }

    public async getStudentLessons(
        queryParams: QueryParamsDTO,
        studentId: number,
    ): Promise<DataListResponse<LessonViewModel>> {
        const query = this.lessonsRepository.getAllQByStudent(studentId);

        const config = this.getDatatablesConfig();

        const [lessons, count] = await ApplyToQueryExtension.applyToQuery<Lesson>(
            queryParams,
            query,
            config,
        );
        const model = this.lessonsViewModelFactory.initLessonListViewModel(lessons);
        return new DataListResponse<LessonViewModel>(model, count);
    }

    public async getInstructorLessons(
        queryParams: QueryParamsDTO,
        instructorId: number,
    ): Promise<DataListResponse<LessonViewModel>> {
        const query = this.lessonsRepository.getAllQByInstructor(instructorId);

        const config = this.getDatatablesConfig();

        const [lessons, count] = await ApplyToQueryExtension.applyToQuery<Lesson>(
            queryParams,
            query,
            config,
        );

        const model = this.lessonsViewModelFactory.initLessonListViewModel(lessons);

        return new DataListResponse<LessonViewModel>(model, count);
    }

    public async updateLesson(id: number, dto: UpdateLessonDto): Promise<LessonViewModel> {
        await this.validateUpdate(id);

        const lesson = await this.lessonsRepository.update(id, dto);

        return this.lessonsViewModelFactory.initLessonViewModel(lesson);
    }

    private async validateCreate(dto: CreateLessonDto): Promise<Course> {
        await this.checkIfExistsByTheme(dto.theme);
        return await this.checkIfCourseExists(dto.courseId);
    }

    private async validateDelete(id: number): Promise<void> {
        await this.checkIfExists(id);
    }

    private async validateUpdate(id: number): Promise<void> {
        await this.checkIfExists(id);
    }

    private async checkIfCourseExists(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) {
            throw new BadRequestException("Provided course does not exist");
        }

        return course;
    }

    private async checkIfExistsByTheme(theme: string): Promise<void> {
        const lesson = await this.lessonsRepository.getByTheme(theme);

        if (lesson) {
            throw new ConflictException("Lesson with this theme already exists");
        }
    }

    private async checkIfExists(id: number): Promise<void> {
        const lesson = await this.lessonsRepository.getById(id);

        if (!lesson) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }
    }

    private getDatatablesConfig(): DatatablesConfig {
        return {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "lesson",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "theme",
                    prop: "theme",
                    tableName: "lesson",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "date",
                    prop: "date",
                    tableName: "lesson",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Date,
                },
            ],
        };
    }
}

interface ILessonsService {
    createLesson(dto: CreateLessonDto): Promise<LessonViewModel>;
    deleteLesson(id: number): Promise<void>;
    getLesson(id: number): Promise<LessonViewModel>;
    getLessons(queryParams: QueryParamsDTO): Promise<DataListResponse<LessonViewModel>>;
    getStudentLessons(
        queryParams: QueryParamsDTO,
        studentId: number,
    ): Promise<DataListResponse<LessonViewModel>>;
    getInstructorLessons(
        queryParams: QueryParamsDTO,
        instructorId: number,
    ): Promise<DataListResponse<LessonViewModel>>;
    updateLesson(id: number, dto: UpdateLessonDto): Promise<LessonViewModel>;
}

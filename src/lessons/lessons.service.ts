import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension, DatatablesConfig } from "@common/query-extention";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { Course } from "@app/courses/entities/course.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { ILessonsRepository } from "./lessons.repository";
import { LessonModelFactory, LessonViewModelFactory } from "./model-factories";
import { LessonViewModel, StudentLessonListViewModel } from "./view-models";
import { BaseErrorMessage } from "@common/enum";
import { User } from "@app/users/entities/user.entity";
import { QueryRunner } from "typeorm";

@Injectable()
export class LessonsService implements ILessonsService {
    constructor(
        private readonly lessonsRepository: ILessonsRepository,
        private readonly coursesRepository: ICoursesRepository,
        private readonly lessonViewModelFactory: LessonViewModelFactory,
    ) {}

    public async createLesson(dto: CreateLessonDto, user: User): Promise<LessonViewModel> {
        const course = await this.validateCreate(dto);

        const transaction = await this.lessonsRepository.initTrx();

        try {
            const newEntity = LessonModelFactory.create({
                theme: dto.theme,
                date: dto.date,
                course,
                createdAt: new Date(),
                createdBy: user,
            });

            const lesson = await this.lessonsRepository.trxCreate(transaction, newEntity);
            await this.updateCourseAvailableFlag(transaction, course);

            await this.lessonsRepository.commitTrx(transaction);

            return this.lessonViewModelFactory.initLessonViewModel(lesson);
        } catch (err) {
            console.error(err);

            await this.lessonsRepository.rollbackTrx(transaction);

            throw err;
        }
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

        return this.lessonViewModelFactory.initLessonViewModel(lesson);
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

        const model = this.lessonViewModelFactory.initLessonListViewModel(lessons);

        return new DataListResponse<LessonViewModel>(model, count);
    }

    public async getStudentLessons(
        queryParams: QueryParamsDTO,
        studentId: number,
    ): Promise<DataListResponse<StudentLessonListViewModel>> {
        const query = this.lessonsRepository.getAllQByStudent(studentId);

        const config = this.getDatatablesConfig();

        const [lessons, count] = await ApplyToQueryExtension.applyToQuery<Lesson>(
            queryParams,
            query,
            config,
        );
        const model = this.lessonViewModelFactory.initStudentLessonListViewModel(lessons);
        return new DataListResponse<StudentLessonListViewModel>(model, count);
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

        const model = this.lessonViewModelFactory.initLessonListViewModel(lessons);

        return new DataListResponse<LessonViewModel>(model, count);
    }

    public async updateLesson(
        id: number,
        dto: UpdateLessonDto,
        user: User,
    ): Promise<LessonViewModel> {
        const course = await this.validateUpdate(id, dto);

        const updatedEntity = LessonModelFactory.update({
            id,
            theme: dto.theme,
            date: dto.date,
            course,
            modifiedAt: new Date(),
            modifiedBy: user,
        });

        const lesson = await this.lessonsRepository.update(updatedEntity);

        return this.lessonViewModelFactory.initLessonViewModel(lesson);
    }

    private async validateCreate(dto: CreateLessonDto): Promise<Course> {
        await this.checkIfExistsByTheme(dto.theme);
        return await this.checkIfCourseExists(dto.courseId);
    }

    private async validateDelete(id: number): Promise<void> {
        await this.checkIfExists(id);
    }

    private async validateUpdate(id: number, dto: UpdateLessonDto): Promise<Course> {
        const lesson = await this.checkIfExists(id);

        if (dto.theme) {
            await this.checkIfExistsByTheme(dto.theme);
        }

        return dto.courseId ? await this.checkIfCourseExists(dto.courseId) : lesson.course;
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

    private async checkIfExists(id: number): Promise<Lesson> {
        const lesson = await this.lessonsRepository.getById(id);

        if (!lesson) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        return lesson;
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
                    name: "courseId",
                    prop: "id",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
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

    private async updateCourseAvailableFlag(
        transaction: QueryRunner,
        course: Course,
    ): Promise<void> {
        const lessons = await this.lessonsRepository.trxGetAllByCourseId(transaction, course.id);

        if (lessons.length >= 5) {
            course.available = true;
            await this.coursesRepository.update(course);
        }
    }
}

interface ILessonsService {
    createLesson(dto: CreateLessonDto, creator: User): Promise<LessonViewModel>;
    deleteLesson(id: number): Promise<void>;
    getLesson(id: number): Promise<LessonViewModel>;
    getLessons(queryParams: QueryParamsDTO): Promise<DataListResponse<LessonViewModel>>;
    getStudentLessons(
        queryParams: QueryParamsDTO,
        studentId: number,
    ): Promise<DataListResponse<StudentLessonListViewModel>>;
    getInstructorLessons(
        queryParams: QueryParamsDTO,
        instructorId: number,
    ): Promise<DataListResponse<LessonViewModel>>;
    updateLesson(id: number, dto: UpdateLessonDto, user: User): Promise<LessonViewModel>;
}

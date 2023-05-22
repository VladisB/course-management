import {
    BadRequestException,
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";
import { ILessonGradesRepository } from "./lesson-grades.repository";
import { User } from "src/users/entities/user.entity";
import { ILessonsRepository } from "src/lessons/lessons.repository";
import { IUsersRepository } from "src/users/users.repository";
import { LessonGradesViewModelFactory } from "./model-factories";
import { LessonGradeViewModel } from "./view-models";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { BaseErrorMessage } from "src/common/enum";

@Injectable()
export class LessonGradesService implements ILessonGradesService {
    constructor(
        private readonly lessonGradesRepository: ILessonGradesRepository,
        private readonly lessonsRepository: ILessonsRepository,
        private readonly usersRepository: IUsersRepository,
        private readonly lessonGradesViewModelFactory: LessonGradesViewModelFactory,
    ) {}

    //#region Public methods
    public async createGrade(
        dto: CreateLessonGradeDto,
        creator: User,
    ): Promise<LessonGradeViewModel> {
        await this.validateCreate(dto);

        const grade = await this.lessonGradesRepository.create(dto, creator.id);

        return this.lessonGradesViewModelFactory.initLessonGradesViewModel(grade);
    }

    public async deleteGrade(id: number): Promise<void> {
        const grade = await this.lessonGradesRepository.getById(id);

        if (!grade) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        await this.lessonGradesRepository.deleteById(id);
    }

    public async getAllGrades(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<LessonGradeViewModel>> {
        const query = this.lessonGradesRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "lesson_grades",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentId",
                    prop: "id",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentName",
                    prop: "first_name",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "studentLastName",
                    prop: "last_name",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "grade",
                    prop: "grade",
                    tableName: "lesson_grades",
                    isSearchable: false,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "createdBy",
                    prop: "email",
                    tableName: "instructor",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Date,
                },
            ],
        };

        const [lessonGrades, count] = await ApplyToQueryExtension.applyToQuery<LessonGrades>(
            queryParams,
            query,
            config,
        );

        const model = this.lessonGradesViewModelFactory.initLessonGradeListViewModel(lessonGrades);

        return new DataListResponse<LessonGradeViewModel>(model, count);
    }

    public async getGrade(id: number): Promise<LessonGradeViewModel> {
        const grade = await this.lessonGradesRepository.getById(id);

        if (!grade) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        return this.lessonGradesViewModelFactory.initLessonGradesViewModel(grade);
    }

    public async updateGrade(id: number, dto: UpdateLessonGradeDto): Promise<LessonGrades> {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region Private methods
    private async validateCreate(dto: CreateLessonGradeDto): Promise<void> {
        await this.checkIfGradeNotExists(dto);
        const lesson = await this.checkIfLessonExists(dto.lessonId);
        const student = await this.checkIfStudentExists(dto.studentId);
        await this.checkIfStudentAssignedToLessonsCourse(student, lesson);
    }

    private async checkIfGradeNotExists(dto: CreateLessonGradeDto): Promise<void> {
        const grade = await this.lessonGradesRepository.getByLesson(dto.lessonId, dto.studentId);

        if (grade) {
            throw new ConflictException("Grade already exists");
        }
    }

    private async checkIfLessonExists(id: number): Promise<Lesson> {
        const lesson = await this.lessonsRepository.getById(id);

        if (!lesson) {
            throw new BadRequestException("Provided lesson not found");
        }

        return lesson;
    }

    private async checkIfStudentExists(id: number): Promise<User> {
        const student = await this.usersRepository.getStudentById(id);

        if (!student) {
            throw new BadRequestException("Provided student not found");
        }

        return student;
    }

    private async checkIfStudentAssignedToLessonsCourse(
        student: User,
        lesson: Lesson,
    ): Promise<void> {
        if (
            lesson.course.id &&
            !student.studentCourses.find((sCourses) => sCourses.courseId === lesson.course.id)
        ) {
            throw new BadRequestException("Provided student is not assigned to the lessons course");
        }
    }
    //#endregion
}

export abstract class ILessonGradesService {
    abstract createGrade(dto: CreateLessonGradeDto, creator: User): Promise<LessonGradeViewModel>;
    abstract deleteGrade(id: number): Promise<void>;
    abstract getAllGrades(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<LessonGradeViewModel>>;
    abstract getGrade(id: number): Promise<LessonGradeViewModel>;
    abstract updateGrade(id: number, dto: UpdateLessonGradeDto): Promise<LessonGrades>;
}

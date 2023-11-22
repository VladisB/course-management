import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplyToQueryExtension } from "@common/query-extention";
import { AppLimit, BaseErrorMessage } from "@common/enum";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { ILessonGradesRepository } from "./lesson-grades.repository";
import { ILessonsRepository } from "@app/lessons/lessons.repository";
import { IStudentCoursesRepository } from "@app/student-courses/student-courses.repository";
import { IUsersRepository } from "@app/users/users.repository";
import { Lesson } from "@app/lessons/entities/lesson.entity";
import { LessonGradeViewModel } from "./view-models";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { LessonGradesViewModelFactory } from "./model-factories";
import { QueryRunner } from "typeorm";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";
import { User } from "@app/users/entities/user.entity";
import { StudentCoursesModelFactory } from "@app/student-courses/model-factories/student-courses.factory";
import { LessonGradesModelFactory } from "./model-factories/lesson-grades.factory";

@Injectable()
export class LessonGradesService implements ILessonGradesService {
    constructor(
        private readonly lessonGradesRepository: ILessonGradesRepository,
        private readonly lessonsRepository: ILessonsRepository,
        private readonly usersRepository: IUsersRepository,
        private readonly lessonGradesViewModelFactory: LessonGradesViewModelFactory,
        private readonly studentCoursesRepository: IStudentCoursesRepository,
    ) {}

    //#region Public methods
    public async createGrade(dto: CreateLessonGradeDto, user: User): Promise<LessonGradeViewModel> {
        const [lesson, student] = await this.validateCreate(dto);

        const transaction = await this.lessonGradesRepository.initTrx();

        try {
            const newEntity = LessonGradesModelFactory.create({
                lesson,
                student,
                grade: dto.grade,
                createdBy: user,
                createdAt: new Date(),
            });

            const grade = await this.lessonGradesRepository.trxCreate(transaction, newEntity);
            await this.trxUpdateFinalGrade(transaction, student, lesson.course.id);

            await this.lessonGradesRepository.commitTrx(transaction);

            return this.lessonGradesViewModelFactory.initLessonGradesViewModel(grade);
        } catch (err) {
            console.error(err);

            await this.lessonGradesRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async deleteGrade(id: number): Promise<void> {
        const [grade, student] = await this.validateDelete(id);

        const transaction = await this.lessonGradesRepository.initTrx();

        try {
            await this.lessonGradesRepository.trxDeleteById(transaction, id);
            await this.trxUpdateFinalGrade(transaction, student, grade.lesson.course.id);

            await this.lessonGradesRepository.commitTrx(transaction);
        } catch (err) {
            console.error(err);

            await this.lessonGradesRepository.rollbackTrx(transaction);

            throw err;
        }
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
                    tableName: "instructorCreatedBy",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Date,
                },
                {
                    name: "updatedBy",
                    prop: "email",
                    tableName: "instructorModifiedBy",
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

    public async updateGrade(
        id: number,
        dto: UpdateLessonGradeDto,
        user: User,
    ): Promise<LessonGradeViewModel> {
        const [lesson, student] = await this.validateUpdate(id, dto);

        const transaction = await this.lessonGradesRepository.initTrx();

        try {
            const updatedEntity = LessonGradesModelFactory.update({
                id,
                lesson,
                student,
                grade: dto.grade,
                modifiedBy: user,
                modifiedAt: new Date(),
            });

            const grade = await this.lessonGradesRepository.trxUpdate(transaction, updatedEntity);
            await this.trxUpdateFinalGrade(transaction, student, grade.lesson.course.id);

            await this.lessonGradesRepository.commitTrx(transaction);

            return this.lessonGradesViewModelFactory.initLessonGradesViewModel(grade);
        } catch (err) {
            console.error(err);

            await this.lessonGradesRepository.rollbackTrx(transaction);

            throw err;
        }
    }
    //#endregion

    //#region Private methods
    private async trxUpdateFinalGrade(
        transaction: QueryRunner,
        student: User,
        courseId: number,
    ): Promise<void> {
        const gradesByCourse = await this.lessonGradesRepository.trxGetAllByCourse(
            transaction,
            courseId,
            student.id,
        );

        const gradesSum = gradesByCourse.reduce((acc, curr) => acc + curr.grade, 0);
        const finalGrade =
            gradesByCourse.length > 0 && gradesSum ? gradesSum / gradesByCourse.length : 0;

        const studentCourse = await this.studentCoursesRepository.trxGetByCourseAndStudent(
            transaction,
            courseId,
            student.id,
        );

        const lessonsByCourse = await this.lessonsRepository.trxGetAllByCourseId(
            transaction,
            courseId,
        );

        const passedMark =
            finalGrade >= AppLimit.PassedLimit && gradesByCourse.length === lessonsByCourse.length;

        const updatedEntity = StudentCoursesModelFactory.update({
            id: studentCourse.id,
            student,
            course: studentCourse.course,
            finalaMark: finalGrade,
            passed: passedMark,
            modifiedAt: new Date(),
        });

        await this.studentCoursesRepository.trxUpdate(transaction, updatedEntity);
    }

    private async validateCreate(dto: CreateLessonGradeDto): Promise<readonly [Lesson, User]> {
        await this.checkIfGradeNotExists(dto);
        const lesson = await this.checkIfLessonExists(dto.lessonId);
        const student = await this.checkIfStudentExists(dto.studentId);
        await this.checkIfStudentAssignedToLessonsCourse(student, lesson);

        return [lesson, student];
    }

    private async validateDelete(id: number): Promise<readonly [LessonGrades, User]> {
        const grade = await this.checkIfGradeExists(id);
        const student = await this.checkIfStudentExists(grade.student.id);

        return [grade, student];
    }

    private async validateUpdate(
        id: number,
        dto: UpdateLessonGradeDto,
    ): Promise<readonly [Lesson, User]> {
        const grade = await this.checkIfGradeExists(id);
        const lesson = dto.lessonId && (await this.checkIfLessonExists(dto.lessonId));
        let student = dto.studentId && (await this.checkIfStudentExists(dto.studentId));

        if (!student && grade) {
            student = await this.usersRepository.getStudentById(grade.student.id);
        }

        if (lesson && student) {
            await this.checkIfStudentAssignedToLessonsCourse(student, lesson);
        }

        return [lesson, student];
    }

    private async checkIfGradeNotExists(
        dto: CreateLessonGradeDto | UpdateLessonGradeDto,
        idToIgnore?: number,
    ): Promise<void> {
        const grade = await this.lessonGradesRepository.getByLesson(dto.lessonId, dto.studentId);

        if (grade && grade.id !== idToIgnore) {
            throw new BadRequestException("Grade for this lesson and student already exists");
        }
    }

    private async checkIfGradeExists(id: number): Promise<LessonGrades> {
        const grade = await this.lessonGradesRepository.getById(id);

        if (!grade) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        return grade;
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
    abstract updateGrade(
        id: number,
        dto: UpdateLessonGradeDto,
        modifiedBy: User,
    ): Promise<LessonGradeViewModel>;
}

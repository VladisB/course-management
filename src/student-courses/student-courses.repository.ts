import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseErrorMessage } from "src/common/enum";
import { Course } from "src/courses/entities/course.entity";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { StudentCourses } from "./entities/student-courses.entity";
import { UpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class StudentCoursesRepository extends BaseRepository implements IStudentCoursesRepository {
    private readonly tableName = "student_courses";

    constructor(
        @InjectRepository(StudentCourses)
        private readonly entityRepository: Repository<StudentCourses>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public async trxBulkDelete(queryRunner: QueryRunner, idList: number[]): Promise<void> {
        await queryRunner.manager.delete(StudentCourses, {
            id: In(idList),
        });
    }

    public async create(courseId: number, studentId: number): Promise<StudentCourses> {
        try {
            const feedBack = this.entityRepository.create({
                course: { id: courseId },
                student: { id: studentId },
            });

            const { id } = await this.entityRepository.save(feedBack);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(id: number, dto: UpdateStudentCoursesDto): Promise<StudentCourses> {
        try {
            const feedBack = await this.entityRepository.preload({
                id,
                ...dto,
                feedback: dto.feedBack,
            });

            return await this.entityRepository.save(feedBack);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxUpdateFinalGrade(
        queryRunner: QueryRunner,
        id: number,
        finalGrade: number,
    ): Promise<StudentCourses> {
        try {
            const entity = await queryRunner.manager.preload(StudentCourses, {
                id,
                finalMark: finalGrade,
            });

            return await queryRunner.manager.save(entity);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async getById(id: number): Promise<StudentCourses> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public async getByIdList(idList: number[]): Promise<StudentCourses[]> {
        return await this.entityRepository.find({
            relations: {
                course: true,
                student: true,
            },
            where: {
                id: In(idList),
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<StudentCourses> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("student_courses.course", "course")
            .innerJoinAndSelect("student_courses.student", "user");

        return userQuery;
    }

    public async getByCourseAndStudent(
        courseId: number,
        studentId: number,
    ): Promise<StudentCourses> {
        return await this.entityRepository.findOne({
            where: {
                course: { id: courseId },
                student: { id: studentId },
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public async trxGetByCourseAndStudent(
        queryRunner: QueryRunner,
        courseId: number,
        studentId: number,
    ): Promise<StudentCourses> {
        return await queryRunner.manager.findOne(StudentCourses, {
            where: {
                course: { id: courseId },
                student: { id: studentId },
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public async bulkCreate(studentId: number, courseIdList: number[]): Promise<StudentCourses[]> {
        const enteties = courseIdList.map((id) =>
            this.entityRepository.create({
                course: { id },
                student: { id: studentId },
            }),
        );

        const entityList = await this.entityRepository.save(enteties);

        return await this.getByIdList(entityList.map((entity) => entity.id));
    }

    public async trxBulkCreate(
        queryRunner: QueryRunner,
        studentId: number,
        courseIdList: number[],
    ): Promise<StudentCourses[]> {
        const enteties = courseIdList.map((id) =>
            this.entityRepository.create({
                course: { id },
                student: { id: studentId },
            }),
        );

        const entityList = await queryRunner.manager.save(enteties);

        return await this.getByIdList(entityList.map((entity) => entity.id));
    }

    public async deleteById(id: number): Promise<void> {
        try {
            await this.entityRepository.delete(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

export abstract class IStudentCoursesRepository extends IBaseRepository {
    abstract bulkCreate(studentId: number, courseIdList: number[]): Promise<StudentCourses[]>;
    abstract trxBulkCreate(
        queryRunner: QueryRunner,
        studentId: number,
        courseIdList: number[],
    ): Promise<StudentCourses[]>;
    abstract trxBulkDelete(queryRunner: QueryRunner, idList: number[]): Promise<void>;
    abstract create(courseId: number, instructorId: number): Promise<StudentCourses>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): any;
    abstract getByCourseAndStudent(courseId: number, studentId: number): Promise<StudentCourses>;
    abstract trxGetByCourseAndStudent(
        queryRunner: QueryRunner,
        courseId: number,
        studentId: number,
    ): Promise<StudentCourses>;
    abstract getById(id: number): Promise<StudentCourses>;
    abstract getByIdList(idList: number[]): Promise<StudentCourses[]>;
    abstract update(id: number, dto: UpdateStudentCoursesDto): Promise<StudentCourses>;
    abstract trxUpdateFinalGrade(
        queryRunner: QueryRunner,
        id: number,
        finalGrade: number,
    ): Promise<StudentCourses>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseErrorMessage } from "@common/enum";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { StudentCourses } from "./entities/student-courses.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";

@Injectable()
export class StudentCoursesRepository extends BaseRepository implements IStudentCoursesRepository {
    private readonly tableName = "student_courses";

    constructor(
        @InjectRepository(StudentCourses)
        private readonly entityRepository: Repository<StudentCourses>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async trxBulkDelete(queryRunner: QueryRunner, idList: number[]): Promise<void> {
        await queryRunner.manager.delete(StudentCourses, {
            id: In(idList),
        });
    }

    public async create(entity: StudentCourses): Promise<StudentCourses> {
        try {
            const { id } = await this.entityRepository.save(entity);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(entity: StudentCourses): Promise<StudentCourses> {
        try {
            const { id } = await this.entityRepository.save(entity);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxUpdate(
        queryRunner: QueryRunner,
        entity: StudentCourses,
    ): Promise<StudentCourses> {
        try {
            const { id: entityId } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, entityId);
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

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<StudentCourses> {
        return await queryRunner.manager.findOne(StudentCourses, {
            where: {
                id,
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public async trxGetByIdList(
        queryRunner: QueryRunner,
        idList: number[],
    ): Promise<StudentCourses[]> {
        return await queryRunner.manager.find(StudentCourses, {
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

    public async trxBulkCreate(
        queryRunner: QueryRunner,
        entities: StudentCourses[],
    ): Promise<StudentCourses[]> {
        const entityList = await queryRunner.manager.save(entities);

        return await this.trxGetByIdList(
            queryRunner,
            entityList.map((entity) => entity.id),
        );
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }
}

export abstract class IStudentCoursesRepository extends IBaseRepository {
    abstract trxBulkCreate(
        queryRunner: QueryRunner,
        entities: StudentCourses[],
    ): Promise<StudentCourses[]>;
    abstract trxBulkDelete(queryRunner: QueryRunner, idList: number[]): Promise<void>;
    abstract create(entity: StudentCourses): Promise<StudentCourses>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<StudentCourses>;
    abstract getByCourseAndStudent(courseId: number, studentId: number): Promise<StudentCourses>;
    abstract trxGetByCourseAndStudent(
        queryRunner: QueryRunner,
        courseId: number,
        studentId: number,
    ): Promise<StudentCourses>;
    abstract getById(id: number): Promise<StudentCourses>;
    abstract trxGetById(queryRunner: QueryRunner, id: number): Promise<StudentCourses>;
    abstract trxGetByIdList(queryRunner: QueryRunner, idList: number[]): Promise<StudentCourses[]>;
    abstract update(entity: StudentCourses): Promise<StudentCourses>;
    abstract trxUpdate(queryRunner: QueryRunner, entity: StudentCourses): Promise<StudentCourses>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { BaseErrorMessage } from "@app/common/enum";

@Injectable()
export class LessonGradesRepository extends BaseRepository implements ILessonGradesRepository {
    private readonly tableName = "lesson_grades";

    constructor(
        @InjectRepository(LessonGrades)
        private readonly entityRepository: Repository<LessonGrades>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async getByLesson(lessonId: number, studentId: number): Promise<LessonGrades> {
        return await this.entityRepository.findOne({
            where: {
                lesson: { id: lessonId },
                student: { id: studentId },
            },
            relations: {
                createdBy: true,
                student: true,
            },
        });
    }

    public async getAllByCourse(courseId: number, studentId: number): Promise<LessonGrades[]> {
        return await this.entityRepository.find({
            where: {
                lesson: { course: { id: courseId } },
                student: { id: studentId },
            },
            relations: {
                createdBy: true,
                student: true,
            },
        });
    }

    trxGetAllByCourse(
        queryRunner: QueryRunner,
        courseId: number,
        studentId: number,
    ): Promise<LessonGrades[]> {
        return queryRunner.manager.find(LessonGrades, {
            where: {
                lesson: { course: { id: courseId } },
                student: { id: studentId },
            },
            relations: {
                createdBy: true,
                student: true,
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<LessonGrades> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect(`${this.tableName}.student`, "student")
            .leftJoinAndSelect(`${this.tableName}.lesson`, "lesson")
            .leftJoinAndSelect(`${this.tableName}.createdBy`, "instructorCreatedBy")
            .leftJoinAndSelect(`${this.tableName}.modifiedBy`, "instructorModifiedBy");

        return userQuery;
    }

    public async getById(id: number): Promise<LessonGrades> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                createdBy: true,
                modifiedBy: true,
                student: true,
                lesson: {
                    course: true,
                },
            },
        });
    }

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<LessonGrades> {
        return await queryRunner.manager.findOne(LessonGrades, {
            where: {
                id,
            },
            relations: {
                createdBy: true,
                modifiedBy: true,
                student: true,
                lesson: {
                    course: true,
                },
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async trxDeleteById(queryRunner: QueryRunner, id: number): Promise<void> {
        await queryRunner.manager.delete(LessonGrades, id);
    }

    public async create(entity: LessonGrades): Promise<LessonGrades> {
        const lessonGrade = await this.entityRepository.save(entity);

        return await this.getById(lessonGrade.id);
    }

    public async trxCreate(queryRunner: QueryRunner, entity: LessonGrades): Promise<LessonGrades> {
        const lessonGrade = await queryRunner.manager.save(entity);

        return await this.trxGetById(queryRunner, lessonGrade.id);
    }

    public async trxUpdate(queryRunner: QueryRunner, entity: LessonGrades): Promise<LessonGrades> {
        try {
            const { id } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(entity: LessonGrades): Promise<LessonGrades> {
        try {
            const { id } = await this.entityRepository.save(entity);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

export abstract class ILessonGradesRepository extends IBaseRepository {
    abstract trxCreate(queryRunner: QueryRunner, entity: LessonGrades): Promise<LessonGrades>;
    abstract create(entity: LessonGrades): Promise<LessonGrades>;
    abstract deleteById(id: number): Promise<void>;
    abstract trxDeleteById(queryRunner: QueryRunner, id: number): Promise<void>;
    abstract trxGetById(queryRunner: QueryRunner, id: number): Promise<LessonGrades>;
    abstract getAllQ(): SelectQueryBuilder<LessonGrades>;
    abstract getById(id: number): Promise<LessonGrades>;
    abstract getByLesson(lessonId: number, studentId: number): Promise<LessonGrades>;
    abstract getAllByCourse(courseId: number, studentId: number): Promise<LessonGrades[]>;
    abstract trxGetAllByCourse(
        queryRunner: QueryRunner,
        courseId: number,
        studentId: number,
    ): Promise<LessonGrades[]>;
    abstract update(entity: LessonGrades): Promise<LessonGrades>;
    abstract trxUpdate(queryRunner: QueryRunner, entity: LessonGrades): Promise<LessonGrades>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { Lesson } from "./entities/lesson.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage } from "@app/common/enum";

@Injectable()
export class LessonsRepository extends BaseRepository implements ILessonsRepository {
    private readonly tableName = "lesson";

    constructor(
        @InjectRepository(Lesson)
        private readonly entityRepository: Repository<Lesson>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async trxGetAllByCourseId(
        queryRunner: QueryRunner,
        courseId: number,
    ): Promise<Lesson[]> {
        return await queryRunner.manager.find(Lesson, {
            where: {
                course: { id: courseId },
            },
        });
    }

    public getAllQByStudent(studentId: number): SelectQueryBuilder<Lesson> {
        const query = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("lesson.course", "course")
            .innerJoinAndSelect("course.studentCourses", "studentCourses")
            .where("studentCourses.studentId = :studentId", { studentId })
            .innerJoinAndMapMany(
                "course.courseInstructors",
                "course_instructors",
                "courseInstructors",
                "courseInstructors.courseId = course.id",
            )
            .innerJoinAndSelect("courseInstructors.instructor", "user")
            .leftJoinAndSelect(
                "lesson.grades",
                "lesson_grades",
                "lesson_grades.student_id = :studentId",
                { studentId },
            );

        return query;
    }

    public getAllQByInstructor(instructorId: number): SelectQueryBuilder<Lesson> {
        const query = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("lesson.course", "course")
            .innerJoin("course.courseInstructors", "filteredCourseInstructors")
            .where("filteredCourseInstructors.instructorId = :instructorId", { instructorId })
            .innerJoinAndMapMany(
                "course.courseInstructors",
                "course_instructors",
                "courseInstructors",
                "courseInstructors.courseId = course.id",
            )
            .innerJoinAndSelect("courseInstructors.instructor", "user");

        return query;
    }

    public getAllQ(): SelectQueryBuilder<Lesson> {
        const query = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("lesson.course", "course");

        return query;
    }

    public async getById(id: number): Promise<Lesson> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: [
                "course",
                "course.courseInstructors",
                "course.courseInstructors.instructor",
            ],
        });
    }

    public async getByTheme(theme: string): Promise<Lesson> {
        return await this.entityRepository.findOne({
            where: {
                theme,
            },
            relations: {
                course: true,
            },
        });
    }

    public async trxGetByCourseId(queryRunner: QueryRunner, courseId: number): Promise<Lesson[]> {
        return await queryRunner.manager.find(Lesson, {
            where: {
                course: { id: courseId },
            },
            relations: {
                course: true,
            },
        });
    }

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<Lesson> {
        return await queryRunner.manager.findOne(Lesson, {
            where: {
                id,
            },
            relations: {
                course: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(entity: Lesson): Promise<Lesson> {
        const { id } = await this.entityRepository.save(entity);

        return await this.getById(id);
    }

    public async trxCreate(queryRunner: QueryRunner, entity: Lesson): Promise<Lesson> {
        try {
            const { id } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(entity: Lesson): Promise<Lesson> {
        try {
            const { id } = await this.entityRepository.save(entity);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

export abstract class ILessonsRepository extends IBaseRepository {
    abstract create(entity: Lesson): Promise<Lesson>;
    abstract trxCreate(queryRunner: QueryRunner, entity: Lesson): Promise<Lesson>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Lesson>;
    abstract getAllQByStudent(studentId: number): SelectQueryBuilder<Lesson>;
    abstract getAllQByInstructor(instructorId: number): SelectQueryBuilder<Lesson>;
    abstract trxGetAllByCourseId(queryRunner: QueryRunner, courseId: number): Promise<Lesson[]>;
    abstract getById(id: number): Promise<Lesson>;
    abstract trxGetById(queryRunner: QueryRunner, id: number): Promise<Lesson>;
    abstract getByTheme(theme: string): Promise<Lesson>;
    abstract trxGetByCourseId(queryRunner: QueryRunner, courseId: number): Promise<Lesson[]>;
    abstract update(entity: Lesson): Promise<Lesson>;
}

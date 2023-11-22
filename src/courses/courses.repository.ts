import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage } from "@common/enum";
import { In, QueryRunner, Repository, SelectQueryBuilder, createQueryBuilder } from "typeorm";
import { Course } from "./entities/course.entity";

@Injectable()
export class CoursesRepository extends BaseRepository implements ICoursesRepository {
    private readonly tableName = "course";

    constructor(
        @InjectRepository(Course)
        private readonly courseEntityRepository: Repository<Course>,
    ) {
        super(courseEntityRepository.manager.connection.createQueryRunner());
    }

    public async getAllByStudentId(studentId: number): Promise<Course[]> {
        return await this.courseEntityRepository.find({
            where: {
                studentCourses: { studentId },
            },
            relations: ["studentCourses"],
        });
    }

    public async isAssignedToGroup(id: number): Promise<boolean> {
        const course = await this.courseEntityRepository.findOne({
            where: {
                id,
            },
            relations: ["groupCourses"],
        });

        return course.groupCourses.length > 0;
    }

    public getAllQ(): SelectQueryBuilder<Course> {
        const userQuery = this.courseEntityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect("course.courseInstructors", "courseInstructors")
            .leftJoinAndSelect("courseInstructors.instructor", "users");

        return userQuery;
    }

    public async getById(id: number): Promise<Course> {
        return await this.courseEntityRepository.findOne({
            where: {
                id,
            },
            relations: [
                "courseInstructors",
                "courseInstructors.instructor",
                "groupCourses",
                "studentCourses",
            ],
        });
    }

    public async getLessonsNumberByCourseId(courseId: number): Promise<number> {
        const result = await this.courseEntityRepository.query(
            `SELECT COUNT(*) FROM lesson WHERE course_id = ${courseId}`,
        );

        return Number(result[0].count ?? 0);
    }

    public async getByIdList(idList: number[]): Promise<Course[]> {
        return await this.courseEntityRepository.find({
            where: {
                id: In(idList),
            },
            relations: ["courseInstructors", "courseInstructors.instructor"],
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.courseEntityRepository.delete(id);

        return;
    }

    public async getByName(name: string): Promise<Course> {
        return await this.courseEntityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async create(entity: Course): Promise<Course> {
        try {
            const { id } = await this.courseEntityRepository.save(entity);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxCreate(queryRunner: QueryRunner, entity: Course): Promise<Course> {
        try {
            const newCourse = await queryRunner.manager.save(entity);

            return newCourse;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(entity: Course): Promise<Course> {
        try {
            const newEntity = await this.courseEntityRepository.save(entity);

            return await this.getById(newEntity.id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxUpdate(queryRunner: QueryRunner, entity: Course): Promise<Course> {
        try {
            const newCourse = await queryRunner.manager.save(entity);

            return newCourse;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

@Injectable()
export abstract class ICoursesRepository extends IBaseRepository {
    abstract create(entity: Course): Promise<Course>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Course>;
    abstract getAllByStudentId(studentId: number): Promise<Course[]>;
    abstract getById(id: number): Promise<Course>;
    abstract getByIdList(idList: number[]): Promise<Course[]>;
    abstract getByName(name: string): Promise<Course>;
    abstract trxCreate(queryRunner: QueryRunner, entity: Course): Promise<Course>;
    abstract trxUpdate(queryRunner: QueryRunner, entity: Course): Promise<Course>;
    abstract update(entity: Course): Promise<Course>;
    abstract isAssignedToGroup(id: number): Promise<boolean>;
    abstract getLessonsNumberByCourseId(courseId: number): Promise<number>;
}

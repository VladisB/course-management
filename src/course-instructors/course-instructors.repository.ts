import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { CourseInstructors } from "./entities/course-instructors.entity";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CourseInstructorsRepository
    extends BaseRepository
    implements ICourseInstructorsRepository
{
    private readonly tableName = "course_instructors";

    constructor(
        @InjectRepository(CourseInstructors)
        private readonly entityRepository: Repository<CourseInstructors>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public getAllQ(): SelectQueryBuilder<CourseInstructors> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("course_instructors.course", "course")
            .innerJoinAndSelect("course_instructors.instructor", "user");

        return userQuery;
    }

    public async trxGetAllByCourseId(
        queryRunner: QueryRunner,
        courseId: number,
    ): Promise<CourseInstructors[]> {
        return await queryRunner.manager.find(CourseInstructors, {
            relations: {
                course: true,
                instructor: true,
            },
            where: {
                courseId,
            },
        });
    }

    public async getByDetails(
        instructorIdList: number[],
        courseId: number,
    ): Promise<CourseInstructors[]> {
        return await this.entityRepository.find({
            relations: {
                course: true,
                instructor: true,
            },
            where: {
                courseId,
                instructorId: In(instructorIdList),
            },
        });
    }

    public async create(entity: CourseInstructors): Promise<CourseInstructors> {
        const { id } = await this.entityRepository.save(entity);

        return await this.getById(id);
    }

    public async bulkCreate(entities: CourseInstructors[]): Promise<CourseInstructors[]> {
        const entityList = await this.entityRepository.save(entities);

        return await this.getByIdList(entityList.map((entity) => entity.id));
    }

    public async trxBulkCreate(
        queryRunner: QueryRunner,
        entities: CourseInstructors[],
    ): Promise<CourseInstructors[]> {
        return await queryRunner.manager.save(entities);
    }

    public async getById(id: number): Promise<CourseInstructors> {
        return await this.entityRepository.findOne({
            relations: {
                course: true,
                instructor: true,
            },
            where: {
                id,
            },
        });
    }

    async getByIdWithFullDetails(id: number): Promise<CourseInstructors> {
        const result = await this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("course_instructors.course", "course")
            .where("course_instructors.id = :id", { id })
            .innerJoinAndMapMany(
                "course.courseInstructors",
                "course_instructors",
                "courseInstructors",
                "courseInstructors.courseId = course.id",
            )
            .innerJoinAndSelect("courseInstructors.instructor", "user")
            .getOne();

        return result;
    }

    public async getByIdList(idList: number[]): Promise<CourseInstructors[]> {
        return await this.entityRepository.find({
            relations: {
                course: true,
                instructor: true,
            },
            where: {
                id: In(idList),
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async trxDeleteByIdList(queryRunner: QueryRunner, idList: number[]): Promise<void> {
        await queryRunner.manager.delete(CourseInstructors, {
            id: In(idList),
        });
    }
}

export abstract class ICourseInstructorsRepository extends IBaseRepository {
    abstract bulkCreate(entities: CourseInstructors[]): Promise<CourseInstructors[]>;
    abstract create(entity: CourseInstructors): Promise<CourseInstructors>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<CourseInstructors>;
    abstract getByDetails(
        instructorIdList: number[],
        courseId: number,
    ): Promise<CourseInstructors[]>;
    abstract getById(id: number): Promise<CourseInstructors>;
    abstract getByIdList(idList: number[]): Promise<CourseInstructors[]>;
    abstract getByIdWithFullDetails(id: number): Promise<CourseInstructors>;
    abstract trxBulkCreate(
        queryRunner: QueryRunner,
        entities: CourseInstructors[],
    ): Promise<CourseInstructors[]>;
    abstract trxDeleteByIdList(queryRunner: QueryRunner, idList: number[]): Promise<void>;
    abstract trxGetAllByCourseId(
        queryRunner: QueryRunner,
        courseId: number,
    ): Promise<CourseInstructors[]>;
}

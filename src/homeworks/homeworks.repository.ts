import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { Homework } from "./entities/homework.entity";

@Injectable()
export class HomeworksRepository extends BaseRepository implements IHomeworksRepository {
    private readonly tableName = "homework";

    constructor(
        @InjectRepository(Homework)
        private readonly entityRepository: Repository<Homework>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public getAllQ(): SelectQueryBuilder<Homework> {
        const query = this.entityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect(`${this.tableName}.student`, "student")
            .leftJoinAndSelect(`${this.tableName}.createdBy`, "createdBy")
            .leftJoinAndSelect(`${this.tableName}.modifiedBy`, "modifiedBy");

        return query;
    }

    public getAllByStudentQ(studentId: number): SelectQueryBuilder<Homework> {
        const query = this.entityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect(`${this.tableName}.student`, "student")
            .leftJoinAndSelect(`${this.tableName}.createdBy`, "createdBy")
            .leftJoinAndSelect(`${this.tableName}.modifiedBy`, "modifiedBy")
            .where(`${this.tableName}.student.id = :studentId`, { studentId });

        return query;
    }

    public async getById(id: number): Promise<Homework> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                lesson: {
                    course: true,
                },
                student: true,
                createdBy: true,
                modifiedBy: true,
            },
        });
    }

    public async getByLesson(lessonId: number, studentId: number): Promise<Homework> {
        return await this.entityRepository.findOne({
            where: {
                student: { id: studentId },
                lesson: { id: lessonId },
            },
            relations: {
                lesson: true,
                student: true,
                createdBy: true,
                modifiedBy: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(entity: Homework): Promise<Homework> {
        const homework = await this.entityRepository.save(entity);

        return await this.getById(homework.id);
    }

    public async update(entity: Homework): Promise<Homework> {
        const updatedEntity = await this.entityRepository.save(entity);

        return await this.getById(updatedEntity.id);
    }
}

export abstract class IHomeworksRepository extends IBaseRepository {
    abstract create(entity: Homework): Promise<Homework>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllByStudentQ(studentId: number): SelectQueryBuilder<Homework>;
    abstract getAllQ(): SelectQueryBuilder<Homework>;
    abstract getById(id: number): Promise<Homework>;
    abstract getByLesson(lessonId: number, studentId: number): Promise<Homework>;
    abstract update(entity: Homework): Promise<Homework>;
}

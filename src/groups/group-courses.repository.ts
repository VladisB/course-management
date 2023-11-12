import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { GroupCourses } from "./entities/group-courses.entity";
import { BaseRepository, IBaseRepository } from "@app/common/db/base.repository";

@Injectable()
export class GroupCoursesRepository extends BaseRepository implements IGroupCoursesRepository {
    constructor(
        @InjectRepository(GroupCourses)
        private readonly entityRepository: Repository<GroupCourses>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async create(entity: GroupCourses): Promise<GroupCourses> {
        const { id } = await this.entityRepository.save(entity);

        return await this.getById(id);
    }

    public async trxBulkCreate(
        queryRunner: QueryRunner,
        entityList: GroupCourses[],
    ): Promise<GroupCourses[]> {
        return await queryRunner.manager.save(entityList);
    }

    public async getById(id: number): Promise<GroupCourses> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
                group: true,
            },
        });
    }

    public async getAllByGroupId(groupId: number): Promise<GroupCourses[]> {
        return await this.entityRepository.find({
            where: {
                groupId,
            },
            relations: {
                course: true,
                group: true,
            },
        });
    }

    public async trxGetAllByGroupId(
        queryRunner: QueryRunner,
        groupId: number,
    ): Promise<GroupCourses[]> {
        return await queryRunner.manager.find(GroupCourses, {
            where: {
                groupId,
            },
            relations: {
                course: true,
                group: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }

    public async trxDeleteByGroupId(queryRunner: QueryRunner, groupId: number): Promise<void> {
        await queryRunner.manager.delete(GroupCourses, {
            groupId,
        });

        return;
    }
}

export abstract class IGroupCoursesRepository extends IBaseRepository {
    abstract getById(id: number): Promise<GroupCourses>;
    abstract getAllByGroupId(groupId: number): Promise<GroupCourses[]>;
    abstract trxGetAllByGroupId(queryRunner: QueryRunner, groupId: number): Promise<GroupCourses[]>;
    abstract deleteById(id: number): Promise<void>;
    abstract trxDeleteByGroupId(queryRunner: QueryRunner, groupId: number): Promise<void>;
    abstract create(entity: GroupCourses): Promise<GroupCourses>;
    abstract trxBulkCreate(
        queryRunner: QueryRunner,
        entityList: GroupCourses[],
    ): Promise<GroupCourses[]>;
}

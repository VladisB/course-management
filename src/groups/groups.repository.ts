import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { Group } from "./entities/group.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage } from "@app/common/enum";

@Injectable()
export class GroupsRepository extends BaseRepository implements IGroupsRepository {
    private readonly tableName = "group";

    constructor(
        @InjectRepository(Group)
        private readonly entityRepository: Repository<Group>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public getAllQ(): SelectQueryBuilder<Group> {
        const groupQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("group.faculty", "faculty")
            .leftJoinAndSelect("group.groupCourses", "groupCourses")
            .leftJoinAndSelect("groupCourses.course", "course");

        return groupQuery;
    }

    public async create(entity: Group): Promise<Group> {
        const { id } = await this.entityRepository.save(entity);

        return await this.getById(id);
    }

    public async getByName(name: string): Promise<Group> {
        return await this.entityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async getById(id: number): Promise<Group> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                groupCourses: {
                    course: true,
                },
                faculty: true,
            },
        });
    }

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<Group> {
        return await queryRunner.manager.findOne(Group, {
            where: {
                id,
            },
            relations: {
                groupCourses: {
                    course: true,
                },
                faculty: true,
            },
        });
    }

    public async update(entity: Group): Promise<Group> {
        try {
            const { id: groupId } = await this.entityRepository.save(entity);

            return await this.getById(groupId);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    async trxUpdate(queryRunner: QueryRunner, entity: Group): Promise<Group> {
        try {
            const { id: entityId } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, entityId);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }

    public async getStudentNumberByGroupId(groupId: number): Promise<number> {
        return await this.entityRepository
            .findOne({
                where: {
                    id: groupId,
                },
                relations: {
                    users: true,
                },
            })
            .then((res) => res.users.length);
    }
}

export abstract class IGroupsRepository extends IBaseRepository {
    abstract create(entity: Group): Promise<Group>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Group>;
    abstract getById(id: number): Promise<Group>;
    abstract getByName(name: string): Promise<Group>;
    abstract update(entity: Group): Promise<Group>;
    abstract trxUpdate(queryRunner: QueryRunner, entity: Group): Promise<Group>;
    abstract getStudentNumberByGroupId(groupId: number): Promise<number>;
}

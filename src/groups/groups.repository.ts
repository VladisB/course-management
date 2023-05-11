import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Faculty } from "src/faculties/entities/faculty.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Group } from "./entities/group.entity";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";

@Injectable()
export class GroupsRepository extends BaseRepository implements IGroupsRepository {
    constructor(
        @InjectRepository(Group)
        private readonly entityRepository: Repository<Group>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public getAllQ(): SelectQueryBuilder<Group> {
        const groupQuery = this.entityRepository
            .createQueryBuilder("group")
            .innerJoinAndSelect("group.faculty", "faculty")
            .leftJoinAndSelect("group.groupCourses", "groupCourses")
            .leftJoinAndSelect("groupCourses.course", "course");

        return groupQuery;
    }

    public async create(dto: CreateGroupDto, faculty: Faculty): Promise<Group> {
        const group = this.entityRepository.create({ ...dto, faculty });

        return this.entityRepository.save(group);
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

    public async update(id: number, dto: UpdateGroupDto): Promise<Group> {
        const groupEntity = await this.entityRepository.preload({
            id,
            ...dto,
        });

        const { id: groupId } = await this.entityRepository.save(groupEntity);

        return await this.getById(groupId);
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }
}

export abstract class IGroupsRepository extends IBaseRepository {
    abstract create(dto: CreateGroupDto, faculty: Faculty): Promise<Group>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Group>;
    abstract getById(id: number): Promise<Group>;
    abstract getByName(name: string): Promise<Group>;
    abstract update(id: number, dto: UpdateGroupDto): Promise<Group>;
}

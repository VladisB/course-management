import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Faculty } from "src/faculties/entities/faculty.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./entities/group.entity";

@Injectable()
export class GroupsRepository implements IGroupsRepository {
    constructor(
        @InjectRepository(Group)
        private readonly groupEntityRepository: Repository<Group>,
    ) {}

    public getAllQ(): SelectQueryBuilder<Group> {
        const groupQuery = this.groupEntityRepository
            .createQueryBuilder("group")
            .innerJoinAndSelect("group.faculty", "faculty");

        return groupQuery;
    }

    public async create(dto: CreateGroupDto, faculty: Faculty): Promise<Group> {
        const group = this.groupEntityRepository.create({ ...dto, faculty });

        return this.groupEntityRepository.save(group);
    }

    public async getByName(name: string): Promise<Group> {
        return await this.groupEntityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async getById(id: number): Promise<Group> {
        return await this.groupEntityRepository.findOneBy({ id });
    }
}

interface IGroupsRepository {
    create(dto: CreateGroupDto, faculty: Faculty): Promise<Group>;
    getAllQ(): SelectQueryBuilder<Group>;
    getById(id: number): Promise<Group>;
    getByName(name: string): Promise<Group>;
}

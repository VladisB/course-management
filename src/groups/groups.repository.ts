import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Faculty } from "src/faculties/entities/faculty.entity";
import { Repository } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./entities/group.entity";

@Injectable()
export class GroupsRepository implements IGroupsRepository {
    constructor(
        @InjectRepository(Group)
        private readonly groupEntityRepository: Repository<Group>,
    ) {}

    public async getAll(): Promise<Group[]> {
        return await this.groupEntityRepository.find({
            loadEagerRelations: false,
        });
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
}

interface IGroupsRepository {
    create(dto: CreateGroupDto, faculty: Faculty): Promise<Group>;
    getAll(): Promise<Group[]>;
    getByName(name: string): Promise<Group>;
}

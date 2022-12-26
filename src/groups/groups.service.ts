import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./group.entity";

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {}

    public async createGroup(dto: CreateGroupDto): Promise<Group> {
        const group = this.groupRepository.create(dto);

        return this.groupRepository.save(group);
    }

    public async getGroups(): Promise<Group[]> {
        return await this.groupRepository.find({
            loadEagerRelations: false,
        });
    }
}

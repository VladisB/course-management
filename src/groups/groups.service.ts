import { ConflictException, Injectable } from "@nestjs/common";
import { FacultiesRepository } from "src/faculties/faculties.repository";
import { Faculty } from "src/faculties/faculty.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./group.entity";
import { GroupsRepository } from "./groups.repository";

@Injectable()
export class GroupsService implements IGroupsService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly facultiesRepository: FacultiesRepository,
    ) {}

    public async createGroup(dto: CreateGroupDto): Promise<Group> {
        const faculty = await this.validateCreate(dto);

        return this.groupsRepository.create(dto, faculty);
    }

    public async getGroups(): Promise<Group[]> {
        return await this.groupsRepository.getAll();
    }

    private async validateCreate(dto: CreateGroupDto): Promise<Faculty> {
        return await this.checkIfFacultyExists(dto.facultyId);
    }

    private async checkIfFacultyExists(facultyId: number): Promise<Faculty> {
        const faculty = await this.facultiesRepository.getById(facultyId);

        if (!faculty) throw new ConflictException("Faculty does not exist");

        return faculty;
    }
}

interface IGroupsService {
    createGroup(dto: CreateGroupDto): Promise<Group>;
    getGroups(): Promise<Group[]>;
}

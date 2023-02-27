import { ConflictException, Injectable } from "@nestjs/common";
import { FacultiesRepository } from "src/faculties/faculties.repository";
import { Faculty } from "src/faculties/entities/faculty.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./entities/group.entity";
import { GroupsRepository } from "./groups.repository";
import { GroupsViewModelFactory } from "./model-factories";
import { GroupViewModel } from "./view-models";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";

@Injectable()
export class GroupsService implements IGroupsService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly facultiesRepository: FacultiesRepository,
        private readonly groupsViewModelFactory: GroupsViewModelFactory,
    ) {}

    public async createGroup(dto: CreateGroupDto): Promise<GroupViewModel> {
        const faculty = await this.validateCreate(dto);

        const group = await this.groupsRepository.create(dto, faculty);

        return this.groupsViewModelFactory.initGroupViewModel(group);
    }

    public async getGroups(queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>> {
        const groupQuery = this.groupsRepository.getAllQ();

        const groupsConfig = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "group",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "groupName",
                    prop: "name",
                    tableName: "group",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "facultyName",
                    prop: "name",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [groups, count] = await ApplyToQueryExtension.applyToQuery<Group>(
            queryParams,
            groupQuery,
            groupsConfig,
        );

        const model = this.groupsViewModelFactory.initGroupListViewModel(groups);

        return new DataListResponse<GroupViewModel>(model, count);
    }

    private async validateCreate(dto: CreateGroupDto): Promise<Faculty> {
        await this.checkifNotExistByName(dto.name);

        return await this.checkIfFacultyExists(dto.facultyId);
    }

    private async checkIfFacultyExists(facultyId: number): Promise<Faculty> {
        const faculty = await this.facultiesRepository.getById(facultyId);

        if (!faculty) throw new ConflictException("Faculty does not exist");

        return faculty;
    }

    private async checkifNotExistByName(name: string, id?: number): Promise<void> {
        const group = await this.groupsRepository.getByName(name);

        if (id && group && group.id === id) return;

        if (group) throw new ConflictException(`Group with name ${name} already exists.`);
    }
}

interface IGroupsService {
    createGroup(dto: CreateGroupDto): Promise<GroupViewModel>;
    getGroups(queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>>;
}

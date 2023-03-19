import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
import { UpdateGroupDto } from "./dto/update-group.dto";
import { CoursesRepository } from "src/courses/courses.repository";
import { Course } from "src/courses/entities/course.entity";
import { GroupCoursesRepository } from "./group-courses.repository";

@Injectable()
export class GroupsService implements IGroupsService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly coursesRepository: CoursesRepository,
        private readonly facultiesRepository: FacultiesRepository,
        private readonly groupCoursesRepository: GroupCoursesRepository,
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

    public async getGroup(id: number): Promise<GroupViewModel> {
        const group = await this.groupsRepository.getById(id);

        if (!group) throw new NotFoundException(`Group not found.`);

        return this.groupsViewModelFactory.initGroupViewModel(group);
    }

    public async updateGroup(id: number, dto: UpdateGroupDto): Promise<GroupViewModel> {
        const courses = await this.validateUpdate(id, dto);

        const group = await this.groupsRepository.update(id, dto);
        await this.updateGroupCourses(group, courses);

        const newGroup = await this.groupsRepository.getById(id);

        return this.groupsViewModelFactory.initGroupViewModel(newGroup);
    }

    public async deleteGroup(id: number): Promise<void> {
        const group = await this.validateDelete(id);

        await this.groupsRepository.deleteById(group.id);
    }

    private async updateGroupCourses(group: Group, courses: Course[]): Promise<void> {
        if (!courses.length) return;

        const groupCourses = await this.groupCoursesRepository.getAllByGroupId(group.id);

        if (groupCourses.length) {
            await this.groupCoursesRepository.deleteByGroupId(group.id);
        }

        await this.groupCoursesRepository.bulkCreate(group, courses);
    }

    private async validateCreate(dto: CreateGroupDto): Promise<Faculty> {
        await this.checkifNotExistByName(dto.name);

        return await this.checkIfFacultyExists(dto.facultyId);
    }

    private async validateUpdate(id: number, dto: UpdateGroupDto): Promise<Course[]> {
        const group = await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name, id);
        await this.checkCourseNumber(group, dto);
        const courses = await this.checkIfCoursesExists(dto);
        this.checkIfCoursesAvailable(courses);

        return courses;
    }

    private async validateDelete(id: number): Promise<Group> {
        return await this.checkifExist(id);
    }

    private async checkifExist(id: number): Promise<Group> {
        const group = await this.groupsRepository.getById(id);

        if (!group) throw new NotFoundException();

        return group;
    }

    private async checkIfCoursesExists(dto: UpdateGroupDto): Promise<Course[]> {
        if (!dto.courseIdList?.length) return [];

        const courses = await this.coursesRepository.getByIdList(dto.courseIdList);

        if (courses.length !== dto.courseIdList.length)
            throw new NotFoundException(`Course not found.`);

        return courses;
    }

    private async checkIfCoursesAvailable(courses: Course[]): Promise<void> {
        const coursesWithoutInstructors = courses.filter((course) => !course.instructor);

        if (coursesWithoutInstructors.length)
            throw new ConflictException(
                `Course ${coursesWithoutInstructors[0].name} has no instructor.`,
            );
    }

    private async checkCourseNumber(group: Group, dto: UpdateGroupDto): Promise<void> {
        const assignedCourseIds = group.groupCourses.map((item) => item.courseId);
        const newCourseIds = dto.courseIdList.filter((item) => !assignedCourseIds.includes(item));

        if (group.groupCourses.length >= 5 && newCourseIds.length)
            throw new ConflictException("Course number limit exceeded.");
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
    deleteGroup(id: number): Promise<void>;
    getGroup(id: number): Promise<GroupViewModel>;
    getGroups(queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>>;
    updateGroup(id: number, dto: UpdateGroupDto): Promise<GroupViewModel>;
}

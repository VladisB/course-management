import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { IFacultiesRepository } from "@app/faculties/faculties.repository";
import { Faculty } from "@app/faculties/entities/faculty.entity";
import { CreateGroupDto } from "./dto/create-group.dto";
import { Group } from "./entities/group.entity";
import { IGroupsRepository } from "./groups.repository";
import {
    GroupCoursesModelFactory,
    GroupModelFactory,
    GroupsViewModelFactory,
} from "./model-factories";
import { GroupViewModel } from "./view-models";
import { ApplyToQueryExtension } from "@common/query-extention";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { Course } from "@app/courses/entities/course.entity";
import { IGroupCoursesRepository } from "./group-courses.repository";
import { BaseErrorMessage } from "@common/enum";
import { User } from "@app/users/entities/user.entity";
import { QueryRunner } from "typeorm";

@Injectable()
export class GroupsService implements IGroupsService {
    constructor(
        private readonly groupsRepository: IGroupsRepository,
        private readonly coursesRepository: ICoursesRepository,
        private readonly facultiesRepository: IFacultiesRepository,
        private readonly groupCoursesRepository: IGroupCoursesRepository,
        private readonly groupsViewModelFactory: GroupsViewModelFactory,
    ) {}

    public async createGroup(dto: CreateGroupDto, user: User): Promise<GroupViewModel> {
        const faculty = await this.validateCreate(dto);

        const newEntity = GroupModelFactory.create({
            name: dto.name,
            faculty,
            createdBy: user,
            createdAt: new Date(),
        });

        const group = await this.groupsRepository.create(newEntity);

        return this.groupsViewModelFactory.initGroupViewModel(group);
    }

    public async getGroups(queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>> {
        const query = this.groupsRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "group",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "groupName",
                    prop: "name",
                    tableName: "group",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "facultyName",
                    prop: "name",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };

        const [groups, count] = await ApplyToQueryExtension.applyToQuery<Group>(
            queryParams,
            query,
            config,
        );

        const model = this.groupsViewModelFactory.initGroupListViewModel(groups);

        return new DataListResponse<GroupViewModel>(model, count);
    }

    public async getGroup(id: number): Promise<GroupViewModel> {
        const group = await this.groupsRepository.getById(id);

        if (!group) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.groupsViewModelFactory.initGroupViewModel(group);
    }

    public async updateGroup(id: number, dto: UpdateGroupDto, user: User): Promise<GroupViewModel> {
        const [courses, faculty] = await this.validateUpdate(id, dto);

        const transaction = await this.groupsRepository.initTrx();

        try {
            const updatedEntity = GroupModelFactory.update({
                id,
                name: dto.name,
                faculty,
                modifiedBy: user,
                modifiedAt: new Date(),
            });

            const group = await this.groupsRepository.trxUpdate(transaction, updatedEntity);
            await this.trxUpdateGroupCourses(transaction, group, courses, user);

            await this.groupsRepository.commitTrx(transaction);

            const newGroup = await this.groupsRepository.getById(id);

            return this.groupsViewModelFactory.initGroupViewModel(newGroup);
        } catch (err) {
            console.error(err);

            await this.groupsRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async deleteGroup(id: number): Promise<void> {
        const group = await this.validateDelete(id);

        await this.groupsRepository.deleteById(group.id);
    }

    private async trxUpdateGroupCourses(
        trx: QueryRunner,
        group: Group,
        courses: Course[],
        user: User,
    ): Promise<void> {
        if (!courses || !group || !courses.length) return;

        const groupCourses = await this.groupCoursesRepository.trxGetAllByGroupId(trx, group.id);

        if (groupCourses.length) {
            await this.groupCoursesRepository.trxDeleteByGroupId(trx, group.id);
        }

        const groupCoursesList = courses.map((course) =>
            GroupCoursesModelFactory.create({
                group,
                course,
                createdBy: user,
                createdAt: new Date(),
            }),
        );
        await this.groupCoursesRepository.trxBulkCreate(trx, groupCoursesList);
    }

    private async validateCreate(dto: CreateGroupDto): Promise<Faculty> {
        await this.checkifNotExistByName(dto.name);

        return await this.checkIfFacultyExists(dto.facultyId);
    }

    private async validateUpdate(
        id: number,
        dto: UpdateGroupDto,
    ): Promise<readonly [Course[], Faculty]> {
        const group = await this.checkifExist(id);

        if (dto.name) await this.checkifNotExistByName(dto.name, id);

        if (dto.courseIdList) await this.checkCourseNumber(group, dto.courseIdList);

        const courses = dto.courseIdList && (await this.checkIfCoursesExists(dto));
        if (courses && courses.length) {
            this.checkIfCourseAvailable(courses);
            await this.checkIfCoursesHaveInstructors(courses);
            this.checkIfCoursesAvailable(courses);
        }

        const faculty = dto.facultyId && (await this.checkIfFacultyExists(dto.facultyId));

        return [courses, faculty];
    }

    private async validateDelete(id: number): Promise<Group> {
        const group = await this.checkifExist(id);
        await this.checkIfGroupAssigned(id);

        return group;
    }

    private async checkIfGroupAssigned(groupId: number): Promise<void> {
        const students = await this.groupsRepository.getStudentNumberByGroupId(groupId);

        if (students > 0) {
            throw new BadRequestException(
                `Delete operation not allowed.  Some students are assigned to this group.`,
            );
        }
    }

    private async checkifExist(id: number): Promise<Group> {
        const group = await this.groupsRepository.getById(id);

        if (!group) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return group;
    }

    private async checkIfCoursesExists(dto: UpdateGroupDto): Promise<Course[]> {
        const courses = await this.coursesRepository.getByIdList(dto.courseIdList);

        if (courses.length !== dto.courseIdList.length)
            throw new BadRequestException(`Course(s) not found.`);

        return courses;
    }

    private checkIfCourseAvailable(courseList: Course[]): void {
        for (const course of courseList) {
            if (course.available === false)
                throw new ConflictException(
                    `Course ${course.name} is not available. Course should have more than 5 lessons.`,
                );
        }
    }

    private async checkIfCoursesHaveInstructors(courseList: Course[]): Promise<void> {
        courseList.forEach((course) => {
            if (!course.courseInstructors.length)
                throw new ConflictException(`Course ${course.name} has no instructors.`);
        });
    }

    private checkIfCoursesAvailable(courses: Course[]): void {
        const coursesWithoutInstructors = courses.filter(
            (course) => course.courseInstructors.length === 0,
        );

        if (coursesWithoutInstructors.length)
            throw new ConflictException(`At least one course unavailable`);
    }

    private async checkCourseNumber(group: Group, courseIdList: number[]): Promise<void> {
        const assignedCourseIds = group.groupCourses.map((item) => item.courseId);
        const newCourseIds = courseIdList.filter((item) => !assignedCourseIds.includes(item));

        if (group.groupCourses.length >= 5 && newCourseIds.length)
            throw new ConflictException("Course number limit exceeded.");
    }

    private async checkIfFacultyExists(facultyId: number): Promise<Faculty> {
        const faculty = await this.facultiesRepository.getById(facultyId);

        if (!faculty) throw new ConflictException("Provided faculty does not exist");

        return faculty;
    }

    private async checkifNotExistByName(name: string, id?: number): Promise<void> {
        const group = await this.groupsRepository.getByName(name);

        if (id && group && group.id === id) return;

        if (group) throw new ConflictException(`Group with name ${name} already exists.`);
    }
}

interface IGroupsService {
    createGroup(dto: CreateGroupDto, user: User): Promise<GroupViewModel>;
    deleteGroup(id: number): Promise<void>;
    getGroup(id: number): Promise<GroupViewModel>;
    getGroups(queryParams: QueryParamsDTO): Promise<DataListResponse<GroupViewModel>>;
    updateGroup(id: number, dto: UpdateGroupDto, user: User): Promise<GroupViewModel>;
}

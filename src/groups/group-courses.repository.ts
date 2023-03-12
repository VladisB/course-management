import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "src/courses/entities/course.entity";
import { Repository } from "typeorm";
import { GroupCourses } from "./entities/group-to-course.entity";
import { Group } from "./entities/group.entity";

@Injectable()
export class GroupCoursesRepository implements IGroupsRepository {
    constructor(
        @InjectRepository(GroupCourses)
        private readonly groupCoursesEntityRepository: Repository<GroupCourses>,
    ) {}

    public async create(group: Group, course: Course): Promise<GroupCourses> {
        const groupCourse = this.groupCoursesEntityRepository.create({
            group,
            course,
        });

        const { id } = await this.groupCoursesEntityRepository.save(groupCourse);

        return await this.getById(id);
    }

    public async bulkCreate(group: Group, courses: Course[]): Promise<GroupCourses[]> {
        const groupCoursesEnteties = courses.map((course) =>
            this.groupCoursesEntityRepository.create({
                group,
                course,
            }),
        );

        return await this.groupCoursesEntityRepository.save(groupCoursesEnteties);
    }

    public async getById(id: number): Promise<GroupCourses> {
        return await this.groupCoursesEntityRepository.findOne({
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
        return await this.groupCoursesEntityRepository.find({
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
        await this.groupCoursesEntityRepository.delete(id);

        return;
    }

    public async deleteByGroupId(groupId: number): Promise<void> {
        await this.groupCoursesEntityRepository.delete({
            groupId,
        });

        return;
    }
}

interface IGroupsRepository {
    getById(id: number): Promise<GroupCourses>;
    getAllByGroupId(groupId: number): Promise<GroupCourses[]>;
    deleteById(id: number): Promise<void>;
    create(group: Group, course: Course): Promise<GroupCourses>;
    bulkCreate(group: Group, courses: Course[]): Promise<GroupCourses[]>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { CourseInstructors } from "./entities/course-instructors.entity";

@Injectable()
export class CourseInstructorsRepository implements ICourseInstructorsRepository {
    private readonly tableName = "course_instructors";

    constructor(
        @InjectRepository(CourseInstructors)
        private readonly entityRepository: Repository<CourseInstructors>,
    ) {}

    public getAllQ(): SelectQueryBuilder<CourseInstructors> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("course_instructors.course", "course")
            .innerJoinAndSelect("course_instructors.instructor", "user");

        return userQuery;
    }

    public async getByDetails(
        instructorIdList: number[],
        courseId: number,
    ): Promise<CourseInstructors[]> {
        return await this.entityRepository.find({
            where: {
                instructorId: In(instructorIdList),
                courseId,
            },
            relations: {
                course: true,
                instructor: true,
            },
        });
    }

    public async create(courseId: number, instructorId: number): Promise<CourseInstructors> {
        const groupCourse = this.entityRepository.create({
            course: { id: courseId },
            instructor: { id: instructorId },
        });

        const { id } = await this.entityRepository.save(groupCourse);

        return await this.getById(id);
    }

    public async bulkCreate(
        courseId: number,
        instructorsIds: number[],
    ): Promise<CourseInstructors[]> {
        const groupCoursesEnteties = instructorsIds.map((id) =>
            this.entityRepository.create({
                instructor: { id },
                course: { id: courseId },
            }),
        );

        const entityList = await this.entityRepository.save(groupCoursesEnteties);

        return await this.getByIdList(entityList.map((entity) => entity.id));
    }

    public async getById(id: number): Promise<CourseInstructors> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
                instructor: true,
            },
        });
    }

    public async getByIdList(idList: number[]): Promise<CourseInstructors[]> {
        return await this.entityRepository.find({
            where: {
                id: In(idList),
            },
            relations: {
                course: true,
                instructor: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }
}

interface ICourseInstructorsRepository {
    bulkCreate(courseId: number, instructorsIds: number[]): Promise<CourseInstructors[]>;
    create(courseId: number, instructorId: number): Promise<CourseInstructors>;
    getByDetails(instructorIdList: number[], courseId: number): Promise<CourseInstructors[]>;
    getById(id: number): Promise<CourseInstructors>;
    getByIdList(idList: number[]): Promise<CourseInstructors[]>;
    getAllQ(): SelectQueryBuilder<CourseInstructors>;
}

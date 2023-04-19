import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CourseInstructors } from "./entities/course-instructors.entity";

@Injectable()
export class CourseInstructorsRepository implements ICourseInstructorsRepository {
    constructor(
        @InjectRepository(CourseInstructors)
        private readonly courseInstructorsEntityRepository: Repository<CourseInstructors>,
    ) {}

    public async getByDetails(
        instructorIdList: number[],
        courseId: number,
    ): Promise<CourseInstructors[]> {
        return await this.courseInstructorsEntityRepository.find({
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
        const groupCourse = this.courseInstructorsEntityRepository.create({
            course: { id: courseId },
            instructor: { id: instructorId },
        });

        const { id } = await this.courseInstructorsEntityRepository.save(groupCourse);

        return await this.getById(id);
    }

    public async bulkCreate(
        courseId: number,
        instructorsIds: number[],
    ): Promise<CourseInstructors[]> {
        const groupCoursesEnteties = instructorsIds.map((id) =>
            this.courseInstructorsEntityRepository.create({
                instructor: { id },
                course: { id: courseId },
            }),
        );

        const entityList = await this.courseInstructorsEntityRepository.save(groupCoursesEnteties);

        return await this.getByIdList(entityList.map((entity) => entity.id));
    }

    public async getById(id: number): Promise<CourseInstructors> {
        return await this.courseInstructorsEntityRepository.findOne({
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
        return await this.courseInstructorsEntityRepository.find({
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
        await this.courseInstructorsEntityRepository.delete(id);

        return;
    }
}

interface ICourseInstructorsRepository {
    bulkCreate(courseId: number, instructorsIds: number[]): Promise<CourseInstructors[]>;
    create(courseId: number, instructorId: number): Promise<CourseInstructors>;
    getByDetails(instructorIdList: number[], courseId: number): Promise<CourseInstructors[]>;
    getById(id: number): Promise<CourseInstructors>;
    getByIdList(idList: number[]): Promise<CourseInstructors[]>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "src/courses/entities/course.entity";
import { User } from "src/users/entities/user.entity";
import { In, QueryRunner, Repository } from "typeorm";
import { CourseInstructors } from "./entities/course-to-instructor.entity";

@Injectable()
export class CourseInstructorsRepository implements ICourseInstructorsRepository {
    constructor(
        @InjectRepository(CourseInstructors)
        private readonly courseInstructorsEntityRepository: Repository<CourseInstructors>,
    ) {}

    public async create(course: Course, instructor: User): Promise<CourseInstructors> {
        const groupCourse = this.courseInstructorsEntityRepository.create({
            course,
            instructor,
        });

        const { id } = await this.courseInstructorsEntityRepository.save(groupCourse);

        return await this.getById(id);
    }

    public async bulkCreate(course: Course, instructors: User[]): Promise<CourseInstructors[]> {
        const groupCoursesEnteties = instructors.map((instructor) =>
            this.courseInstructorsEntityRepository.create({
                instructor,
                course,
            }),
        );

        return await this.courseInstructorsEntityRepository.save(groupCoursesEnteties);
    }

    public async trxBulkCreate(
        queryRunner: QueryRunner,
        course: Course,
        instructors: User[],
    ): Promise<CourseInstructors[]> {
        const groupCoursesEnteties = instructors.map((instructor) =>
            this.courseInstructorsEntityRepository.create({
                instructor,
                course,
            }),
        );

        return await queryRunner.manager.save(groupCoursesEnteties);
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

    public async getAllByCourseId(courseId: number): Promise<CourseInstructors[]> {
        return await this.courseInstructorsEntityRepository.find({
            where: {
                courseId,
            },
            relations: {
                course: true,
                instructor: true,
            },
        });
    }

    public async trxGetAllByCourseId(
        queryRunner: QueryRunner,
        courseId: number,
    ): Promise<CourseInstructors[]> {
        return await queryRunner.manager.find(CourseInstructors, {
            where: {
                courseId,
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

    public async trxDeleteByIdList(queryRunner: QueryRunner, idList: number[]): Promise<void> {
        await queryRunner.manager.delete<CourseInstructors>(CourseInstructors, {
            id: In(idList),
        });
    }

    public async deleteByCourseId(courseId: number): Promise<void> {
        await this.courseInstructorsEntityRepository.delete({
            courseId,
        });

        return;
    }
}

interface ICourseInstructorsRepository {
    bulkCreate(course: Course, instructors: User[]): Promise<CourseInstructors[]>;
    create(course: Course, instructor: User): Promise<CourseInstructors>;
    deleteByCourseId(courseId: number): Promise<void>;
    deleteById(id: number): Promise<void>;
    getById(id: number): Promise<CourseInstructors>;
    trxBulkCreate(
        queryRunner: QueryRunner,
        course: Course,
        instructors: User[],
    ): Promise<CourseInstructors[]>;
    trxGetAllByCourseId(queryRunner: QueryRunner, courseId: number): Promise<CourseInstructors[]>;
    trxDeleteByIdList(queryRunner: QueryRunner, idList: number[]): Promise<void>;
}

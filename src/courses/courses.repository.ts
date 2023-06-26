import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage } from "@common/enum";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";

@Injectable()
export class CoursesRepository extends BaseRepository implements ICoursesRepository {
    private readonly tableName = "course";

    constructor(
        @InjectRepository(Course)
        private readonly courseEntityRepository: Repository<Course>,
    ) {
        super(courseEntityRepository.manager.connection.createQueryRunner());
    }

    public async getAllByStudentId(studentId: number): Promise<Course[]> {
        return await this.courseEntityRepository.find({
            where: {
                studentCourses: { studentId },
            },
            relations: ["studentCourses"],
        });
    }

    public async isAssignedToGroup(id: number): Promise<boolean> {
        const course = await this.courseEntityRepository.findOne({
            where: {
                id,
            },
            relations: ["groupCourses"],
        });

        return course.groupCourses.length > 0;
    }

    public getAllQ(): SelectQueryBuilder<Course> {
        const userQuery = this.courseEntityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect("course.courseInstructors", "courseInstructors")
            .leftJoinAndSelect("courseInstructors.instructor", "users");

        return userQuery;
    }

    public async getById(id: number): Promise<Course> {
        return await this.courseEntityRepository.findOne({
            where: {
                id,
            },
            relations: ["courseInstructors", "courseInstructors.instructor"],
        });
    }

    public async getByIdList(idList: number[]): Promise<Course[]> {
        return await this.courseEntityRepository.find({
            where: {
                id: In(idList),
            },
            relations: ["courseInstructors", "courseInstructors.instructor"],
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.courseEntityRepository.delete(id);

        return;
    }

    public async getByName(name: string): Promise<Course> {
        return await this.courseEntityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async create(dto: CreateCourseDto): Promise<Course> {
        try {
            const course = this.courseEntityRepository.create(dto);

            const { id } = await this.courseEntityRepository.save(course);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxCreate(queryRunner: QueryRunner, dto: CreateCourseDto): Promise<Course> {
        const course = this.courseEntityRepository.create(dto);

        try {
            const newCourse = await queryRunner.manager.save(course);

            return newCourse;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(id: number, dto: UpdateCourseDto): Promise<Course> {
        try {
            const course = await this.courseEntityRepository.preload({
                id,
                ...dto,
            });

            return await this.courseEntityRepository.save(course);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxUpdate(
        queryRunner: QueryRunner,
        id: number,
        dto: UpdateCourseDto,
    ): Promise<Course> {
        try {
            const course = await this.courseEntityRepository.preload({
                id,
                ...dto,
            });

            const newCourse = await queryRunner.manager.save(course);

            return newCourse;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

@Injectable()
export abstract class ICoursesRepository extends IBaseRepository {
    abstract create(dto: CreateCourseDto): Promise<Course>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Course>;
    abstract getAllByStudentId(studentId: number): Promise<Course[]>;
    abstract getById(id: number): Promise<Course>;
    abstract getByIdList(idList: number[]): Promise<Course[]>;
    abstract getByName(name: string): Promise<Course>;
    abstract trxCreate(queryRunner: QueryRunner, dto: CreateCourseDto): Promise<Course>;
    abstract trxUpdate(queryRunner: QueryRunner, id: number, dto: UpdateCourseDto): Promise<Course>;
    abstract update(id: number, dto: UpdateCourseDto): Promise<Course>;
    abstract isAssignedToGroup(id: number): Promise<boolean>;
}

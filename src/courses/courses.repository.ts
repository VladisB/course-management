import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/db/base.repository";
import { BaseErrorMessages } from "src/common/db/enum";
import { User } from "src/users/entities/user.entity";
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

    public getAllQ(): SelectQueryBuilder<Course> {
        const userQuery = this.courseEntityRepository.createQueryBuilder(this.tableName);

        return userQuery;
    }

    public async getById(id: number): Promise<Course> {
        return await this.courseEntityRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async getByIdList(idList: number[]): Promise<Course[]> {
        return await this.courseEntityRepository.find({
            where: {
                id: In(idList),
            },
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

            return this.courseEntityRepository.save(course);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }

    public async trxCreate(queryRunner: QueryRunner, dto: CreateCourseDto): Promise<Course> {
        const course = this.courseEntityRepository.create(dto);

        try {
            const newCourse = await queryRunner.manager.save(course);

            return newCourse;
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
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

            throw new Error(BaseErrorMessages.DB_ERROR);
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

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }
}

interface ICoursesRepository {
    create(dto: CreateCourseDto): Promise<Course>;
    deleteById(id: number): Promise<void>;
    getAllQ(): SelectQueryBuilder<Course>;
    getById(id: number): Promise<Course>;
    getByIdList(idList: number[]): Promise<Course[]>;
    getByName(name: string): Promise<Course>;
    trxUpdate(queryRunner: QueryRunner, id: number, dto: UpdateCourseDto): Promise<Course>;
    update(id: number, dto: UpdateCourseDto): Promise<Course>;
}

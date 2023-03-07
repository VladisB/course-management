import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";

@Injectable()
export class CoursesRepository implements ICoursesRepository {
    private readonly tableName = "course";

    constructor(
        @InjectRepository(Course)
        private readonly courseEntityRepository: Repository<Course>,
    ) {}

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
        const faculty = this.courseEntityRepository.create(dto);

        return this.courseEntityRepository.save(faculty);
    }

    public async update(id: number, dto: UpdateCourseDto): Promise<Course> {
        const role = await this.courseEntityRepository.preload({
            id,
            ...dto,
        });

        return await this.courseEntityRepository.save(role);
    }
}

interface ICoursesRepository {
    create(dto: CreateCourseDto): Promise<Course>;
    deleteById(id: number): Promise<void>;
    getAllQ(): SelectQueryBuilder<Course>;
    getById(id: number): Promise<Course>;
    getByIdList(idList: number[]): Promise<Course[]>;
    getByName(name: string): Promise<Course>;
    update(id: number, dto: UpdateCourseDto): Promise<Course>;
}

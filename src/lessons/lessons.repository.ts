import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "src/courses/entities/course.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";

@Injectable()
export class LessonsRepository extends BaseRepository implements ILessonsRepository {
    private readonly tableName = "lesson";

    constructor(
        @InjectRepository(Lesson)
        private readonly entityRepository: Repository<Lesson>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public getAllQ(): SelectQueryBuilder<Lesson> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("lesson.course", "course");

        return userQuery;
    }

    public async getById(id: number): Promise<Lesson> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
            },
        });
    }

    public async getByTheme(theme: string): Promise<Lesson> {
        return await this.entityRepository.findOne({
            where: {
                theme,
            },
            relations: {
                course: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(dto: CreateLessonDto, course: Course): Promise<Lesson> {
        const lessonEntity = this.entityRepository.create({ ...dto, course });

        const lesson = await this.entityRepository.save(lessonEntity);

        return await this.getById(lesson.id);
    }

    public async update(id: number, dto: UpdateLessonDto): Promise<Lesson> {
        const lessonEntity = await this.entityRepository.preload({
            id,
            ...dto,
        });

        const lesson = await this.entityRepository.save(lessonEntity);

        return await this.getById(lesson.id);
    }
}

export abstract class ILessonsRepository extends IBaseRepository {
    abstract create(dto: CreateLessonDto, course: Course): Promise<Lesson>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Lesson>;
    abstract getById(id: number): Promise<Lesson>;
    abstract getByTheme(theme: string): Promise<Lesson>;
    abstract update(id: number, dto: UpdateLessonDto): Promise<Lesson>;
}

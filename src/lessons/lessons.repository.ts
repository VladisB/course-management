import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "src/courses/entities/course.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { Lesson } from "./entities/lesson.entity";

@Injectable()
export class LessonsRepository implements ILessonsRepository {
    private readonly tableName = "lesson";

    constructor(
        @InjectRepository(Lesson)
        private readonly lessonEntityRepository: Repository<Lesson>,
    ) {}

    public getAllQ(): SelectQueryBuilder<Lesson> {
        const userQuery = this.lessonEntityRepository.createQueryBuilder(this.tableName);

        return userQuery;
    }

    public async getById(id: number): Promise<Lesson> {
        return await this.lessonEntityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
            },
        });
    }

    public async getByTheme(theme: string): Promise<Lesson> {
        return await this.lessonEntityRepository.findOne({
            where: {
                theme,
            },
            relations: {
                course: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.lessonEntityRepository.delete(id);
    }

    public async create(dto: CreateLessonDto, course: Course): Promise<Lesson> {
        const lessonEntity = this.lessonEntityRepository.create({ ...dto, course });

        const lesson = await this.lessonEntityRepository.save(lessonEntity);

        return await this.getById(lesson.id);
    }

    public async update(id: number, dto: UpdateLessonDto): Promise<Lesson> {
        const lessonEntity = await this.lessonEntityRepository.preload({
            id,
            ...dto,
        });

        const lesson = await this.lessonEntityRepository.save(lessonEntity);

        return await this.getById(lesson.id);
    }
}

interface ILessonsRepository {
    create(dto: CreateLessonDto, course: Course): Promise<Lesson>;
    deleteById(id: number): Promise<void>;
    getAllQ(): SelectQueryBuilder<Lesson>;
    getById(id: number): Promise<Lesson>;
    getByTheme(theme: string): Promise<Lesson>;
    update(id: number, dto: UpdateLessonDto): Promise<Lesson>;
}

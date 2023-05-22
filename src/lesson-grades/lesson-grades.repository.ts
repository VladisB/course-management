import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";

@Injectable()
export class LessonGradesRepository extends BaseRepository implements ILessonGradesRepository {
    private readonly tableName = "lesson_grades";

    constructor(
        @InjectRepository(LessonGrades)
        private readonly entityRepository: Repository<LessonGrades>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public async getByLesson(lessonId: number, studentId: number): Promise<LessonGrades> {
        return await this.entityRepository.findOne({
            where: {
                lesson: { id: lessonId },
                student: { id: studentId },
            },
            relations: {
                createdBy: true,
                student: true,
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<LessonGrades> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect(`${this.tableName}.student`, "student")
            .leftJoinAndSelect(`${this.tableName}.lesson`, "lesson")
            .leftJoinAndSelect(`${this.tableName}.createdBy`, "instructor");

        return userQuery;
    }

    public async getById(id: number): Promise<LessonGrades> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                createdBy: true,
                student: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(dto: CreateLessonGradeDto, createdBy: number): Promise<LessonGrades> {
        const lessonEntity = this.entityRepository.create({
            ...dto,
            lesson: { id: dto.lessonId },
            student: { id: dto.studentId },
            createdBy: { id: createdBy },
        });

        const lesson = await this.entityRepository.save(lessonEntity);

        return await this.getById(lesson.id);
    }

    // public async update(id: number, dto: UpdateLessonDto): Promise<Lesson> {
    //     const lessonEntity = await this.entityRepository.preload({
    //         id,
    //         ...dto,
    //     });

    //     const lesson = await this.entityRepository.save(lessonEntity);

    //     return await this.getById(lesson.id);
    // }
}

export abstract class ILessonGradesRepository extends IBaseRepository {
    abstract create(dto: CreateLessonGradeDto, createdBy: number): Promise<LessonGrades>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<LessonGrades>;
    abstract getById(id: number): Promise<LessonGrades>;
    abstract getByLesson(lessonId: number, studentId: number): Promise<LessonGrades>;
    // abstract update(id: number, dto: UpdateLessonDto): Promise<Lesson>;
}

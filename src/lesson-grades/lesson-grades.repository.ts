import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { CreateLessonGradeDto } from "./dto/create-lesson-grade.dto";
import { UpdateLessonGradeDto } from "./dto/update-lesson-grade.dto";

@Injectable()
export class LessonGradesRepository extends BaseRepository implements ILessonGradesRepository {
    private readonly tableName = "lesson_grades";

    constructor(
        @InjectRepository(LessonGrades)
        private readonly entityRepository: Repository<LessonGrades>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
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

    public async getAllByCourse(courseId: number, studentId: number): Promise<LessonGrades[]> {
        return await this.entityRepository.find({
            where: {
                lesson: { course: { id: courseId } },
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
            .leftJoinAndSelect(`${this.tableName}.createdBy`, "instructorCreatedBy")
            .leftJoinAndSelect(`${this.tableName}.modifiedBy`, "instructorModifiedBy");

        return userQuery;
    }

    public async getById(id: number): Promise<LessonGrades> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                createdBy: true,
                modifiedBy: true,
                student: true,
            },
        });
    }

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<LessonGrades> {
        return await queryRunner.manager.findOne(LessonGrades, {
            where: {
                id,
            },
            relations: {
                createdBy: true,
                modifiedBy: true,
                student: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(dto: CreateLessonGradeDto, createdBy: number): Promise<LessonGrades> {
        const lessonGradesEntity = this.entityRepository.create({
            ...dto,
            lesson: { id: dto.lessonId },
            student: { id: dto.studentId },
            createdBy: { id: createdBy },
            modifiedBy: { id: createdBy },
        });

        const lessonGrade = await this.entityRepository.save(lessonGradesEntity);

        return await this.getById(lessonGrade.id);
    }

    public async trxCreate(
        queryRunner: QueryRunner,
        dto: CreateLessonGradeDto,
        createdBy: number,
    ): Promise<LessonGrades> {
        const lessonGradesEntity = queryRunner.manager.create(LessonGrades, {
            ...dto,
            lesson: { id: dto.lessonId },
            student: { id: dto.studentId },
            createdBy: { id: createdBy },
            modifiedBy: { id: createdBy },
        });

        const lessonGrade = await queryRunner.manager.save(lessonGradesEntity);

        return await this.trxGetById(queryRunner, lessonGrade.id);
    }

    public async update(
        id: number,
        dto: UpdateLessonGradeDto,
        modifiedBy: number,
    ): Promise<LessonGrades> {
        const lessonGradesEntity = await this.entityRepository.preload({
            id,
            ...dto,
            modifiedBy: { id: modifiedBy },
        });

        const lessonGrade = await this.entityRepository.save(lessonGradesEntity);

        return await this.getById(lessonGrade.id);
    }
}

export abstract class ILessonGradesRepository extends IBaseRepository {
    abstract trxCreate(
        queryRunner: QueryRunner,
        dto: CreateLessonGradeDto,
        createdBy: number,
    ): Promise<LessonGrades>;
    abstract create(dto: CreateLessonGradeDto, createdBy: number): Promise<LessonGrades>;
    abstract deleteById(id: number): Promise<void>;
    abstract trxGetById(queryRunner: QueryRunner, id: number): Promise<LessonGrades>;
    abstract getAllQ(): SelectQueryBuilder<LessonGrades>;
    abstract getById(id: number): Promise<LessonGrades>;
    abstract getByLesson(lessonId: number, studentId: number): Promise<LessonGrades>;
    abstract getAllByCourse(courseId: number, studentId: number): Promise<LessonGrades[]>;
    abstract update(
        id: number,
        dto: UpdateLessonGradeDto,
        modifiedBy: number,
    ): Promise<LessonGrades>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";
import { Homework } from "./entities/homework.entity";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { UpdateHomeworkDto } from "./dto/update-homework.dto";

@Injectable()
export class HomeworksRepository extends BaseRepository implements IHomeworksRepository {
    private readonly tableName = "home_works";

    constructor(
        @InjectRepository(Homework)
        private readonly entityRepository: Repository<Homework>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public getAllQ(): SelectQueryBuilder<Homework> {
        const query = this.entityRepository.createQueryBuilder(this.tableName);

        return query;
    }

    public async getById(id: number): Promise<Homework> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                lesson: true,
                student: true,
                createdBy: true,
                modifiedBy: true,
            },
        });
    }

    public async getByLesson(lessonId: number, studentId: number): Promise<Homework> {
        return await this.entityRepository.findOne({
            where: {
                student: { id: studentId },
                lesson: { id: lessonId },
            },
            relations: {
                lesson: true,
                student: true,
                createdBy: true,
                modifiedBy: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }

    public async create(
        dto: CreateHomeworkDto,
        filePath: string,
        createdBy: number,
    ): Promise<Homework> {
        const homeworkEntity = this.entityRepository.create({
            ...dto,
            filePath,
            lesson: { id: dto.lessonId },
            student: { id: createdBy },
            createdBy: { id: createdBy },
            modifiedBy: { id: createdBy },
        });

        const homework = await this.entityRepository.save(homeworkEntity);

        return await this.getById(homework.id);
    }

    public async update(id: number, dto: UpdateHomeworkDto, modifiedBy: number): Promise<Homework> {
        const lessonGradesEntity = await this.entityRepository.preload({
            id,
            ...dto,
            modifiedBy: { id: modifiedBy },
        });

        const lessonGrade = await this.entityRepository.save(lessonGradesEntity);

        return await this.getById(lessonGrade.id);
    }
}

export abstract class IHomeworksRepository extends IBaseRepository {
    abstract create(dto: CreateHomeworkDto, filePath: string, createdBy: number): Promise<Homework>;
    abstract deleteById(id: number): Promise<void>;
    abstract getByLesson(lessonId: number, studentId: number): Promise<Homework>;
    abstract getAllQ(): SelectQueryBuilder<Homework>;
    abstract getById(id: number): Promise<Homework>;
    abstract update(id: number, dto: UpdateHomeworkDto, modifiedBy: number): Promise<Homework>;
}

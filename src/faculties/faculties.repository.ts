import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { Faculty } from "./entities/faculty.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";

@Injectable()
export class FacultiesRepository extends BaseRepository implements IFacultiesRepository {
    constructor(
        @InjectRepository(Faculty)
        private readonly entityRepository: Repository<Faculty>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public getAllQ(): SelectQueryBuilder<Faculty> {
        const userQuery = this.entityRepository.createQueryBuilder("faculty");

        return userQuery;
    }

    public async getById(id: number): Promise<Faculty> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }

    public async getByName(name: string): Promise<Faculty> {
        return await this.entityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async create(dto: CreateFacultyDto): Promise<Faculty> {
        const faculty = this.entityRepository.create(dto);

        return this.entityRepository.save(faculty);
    }

    public async update(id: number, dto: UpdateFacultyDto): Promise<Faculty> {
        const role = await this.entityRepository.preload({
            id,
            ...dto,
        });

        return await this.entityRepository.save(role);
    }
}

export abstract class IFacultiesRepository extends IBaseRepository {
    abstract create(dto: CreateFacultyDto): Promise<Faculty>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Faculty>;
    abstract getById(id: number): Promise<Faculty>;
    abstract getByName(name: string): Promise<Faculty>;
    abstract update(id: number, dto: UpdateFacultyDto): Promise<Faculty>;
}

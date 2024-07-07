import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Faculty } from "./entities/faculty.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage } from "@app/common/enum";

@Injectable()
export class FacultiesRepository extends BaseRepository implements IFacultiesRepository {
    constructor(
        @InjectRepository(Faculty)
        private readonly entityRepository: Repository<Faculty>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
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

    public async create(entity: Faculty): Promise<Faculty> {
        return this.entityRepository.save(entity);
    }

    public async update(entity: Faculty): Promise<Faculty> {
        try {
            return await this.entityRepository.save(entity);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }
}

export abstract class IFacultiesRepository extends IBaseRepository {
    abstract create(entity: Faculty): Promise<Faculty>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<Faculty>;
    abstract getById(id: number): Promise<Faculty>;
    abstract getByName(name: string): Promise<Faculty>;
    abstract update(entity: Faculty): Promise<Faculty>;
}

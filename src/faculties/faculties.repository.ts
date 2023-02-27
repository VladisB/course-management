import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { Faculty } from "./entities/faculty.entity";

@Injectable()
export class FacultiesRepository implements IFacultiesRepository {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultyEntityRepository: Repository<Faculty>,
    ) {}

    public getAllQ(): SelectQueryBuilder<Faculty> {
        const userQuery = this.facultyEntityRepository.createQueryBuilder("faculty");

        return userQuery;
    }

    public async getById(id: number): Promise<Faculty> {
        return await this.facultyEntityRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async getByName(name: string): Promise<Faculty> {
        return await this.facultyEntityRepository.findOne({
            where: {
                name,
            },
        });
    }

    public async create(dto: CreateFacultyDto): Promise<Faculty> {
        const faculty = this.facultyEntityRepository.create(dto);

        return this.facultyEntityRepository.save(faculty);
    }

    public async update(id: number, dto: UpdateFacultyDto): Promise<Faculty> {
        const role = await this.facultyEntityRepository.preload({
            id,
            ...dto,
        });

        return await this.facultyEntityRepository.save(role);
    }
}

interface IFacultiesRepository {
    create(dto: CreateFacultyDto): Promise<Faculty>;
    getAllQ(): SelectQueryBuilder<Faculty>;
    getById(id: number): Promise<Faculty>;
    getByName(name: string): Promise<Faculty>;
    update(id: number, dto: UpdateFacultyDto): Promise<Faculty>;
}

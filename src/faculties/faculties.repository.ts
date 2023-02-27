import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { Faculty } from "./entities/faculty.entity";

@Injectable()
export class FacultiesRepository implements IFacultiesRepository {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultyEntityRepository: Repository<Faculty>,
    ) {}

    public async getAll(): Promise<Faculty[]> {
        //TODO: add pagination, sorting, filtering
        return await this.facultyEntityRepository.find();
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
}

interface IFacultiesRepository {
    create(dto: CreateFacultyDto): Promise<Faculty>;
    getAll(): Promise<Faculty[]>;
    getById(id: number): Promise<Faculty>;
    getByName(name: string): Promise<Faculty>;
}

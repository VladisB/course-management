import { Injectable } from "@nestjs/common";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesRepository } from "./faculties.repository";
import { Faculty } from "./faculty.entity";

@Injectable()
export class FacultiesService implements IFacultiesService {
    constructor(private readonly facultiesRepository: FacultiesRepository) {}

    public async createFaculty(dto: CreateFacultyDto): Promise<Faculty> {
        return await this.facultiesRepository.create(dto);
    }

    public async getFaculties(): Promise<Faculty[]> {
        return await this.facultiesRepository.getAll();
    }
}

interface IFacultiesService {
    createFaculty(dto: CreateFacultyDto): Promise<Faculty>;
    getFaculties(): Promise<Faculty[]>;
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { Faculty } from "./faculty.entity";

@Injectable()
export class FacultiesService {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultyRepository: Repository<Faculty>,
    ) {}

    public async createFaculty(dto: CreateFacultyDto): Promise<Faculty> {
        const faculty = await this.facultyRepository.create(dto);

        return this.facultyRepository.save(faculty);
    }

    public async getFaculties(): Promise<Faculty[]> {
        return await this.facultyRepository.find();
    }
}

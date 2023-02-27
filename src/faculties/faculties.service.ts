import { ConflictException, Injectable } from "@nestjs/common";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesRepository } from "./faculties.repository";
import { Faculty } from "./entities/faculty.entity";
import { FacultyViewModel } from "./view-models";
import { FacultiesViewModelFactory } from "./model-factories";

@Injectable()
export class FacultiesService implements IFacultiesService {
    constructor(
        private readonly facultiesRepository: FacultiesRepository,
        private readonly facultiesViewModelFactory: FacultiesViewModelFactory,
    ) {}

    public async createFaculty(dto: CreateFacultyDto): Promise<FacultyViewModel> {
        await this.validateCreate(dto);

        const faculty = await this.facultiesRepository.create(dto);

        return this.facultiesViewModelFactory.initFacultyViewModel(faculty);
    }

    public async getFaculties(): Promise<Faculty[]> {
        return await this.facultiesRepository.getAll();
    }

    private async validateCreate(dto: CreateFacultyDto): Promise<void> {
        await this.checkIfFacultyExists(dto.name);
    }

    private async checkIfFacultyExists(name: string): Promise<void> {
        const faculty = await this.facultiesRepository.getByName(name);

        if (faculty) {
            throw new ConflictException("Faculty with this name already exists");
        }
    }
}

interface IFacultiesService {
    createFaculty(dto: CreateFacultyDto): Promise<FacultyViewModel>;
    getFaculties(): Promise<Faculty[]>;
}

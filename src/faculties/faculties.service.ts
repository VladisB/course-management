import { ConflictException, Injectable } from "@nestjs/common";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesRepository } from "./faculties.repository";
import { Faculty } from "./entities/faculty.entity";
import { FacultyViewModel } from "./view-models";
import { FacultiesViewModelFactory } from "./model-factories";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";

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

    public async getFaculties(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<FacultyViewModel>> {
        const facultiesQuery = this.facultiesRepository.getAllQ();

        const facultiesConfig = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [faculties, count] = await ApplyToQueryExtension.applyToQuery<Faculty>(
            queryParams,
            facultiesQuery,
            facultiesConfig,
        );

        const model = this.facultiesViewModelFactory.initFacultyListViewModel(faculties);

        return new DataListResponse<FacultyViewModel>(model, count);
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
    getFaculties(queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>>;
}

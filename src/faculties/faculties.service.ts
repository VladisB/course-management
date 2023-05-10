import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { IFacultiesRepository } from "./faculties.repository";
import { Faculty } from "./entities/faculty.entity";
import { FacultyViewModel } from "./view-models";
import { FacultiesViewModelFactory } from "./model-factories";
import { DataListResponse } from "src/common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { BaseErrorMessage } from "src/common/enum";

@Injectable()
export class FacultiesService implements IFacultiesService {
    constructor(
        private readonly facultiesRepository: IFacultiesRepository,
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
        const query = this.facultiesRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "faculty",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };

        const [faculties, count] = await ApplyToQueryExtension.applyToQuery<Faculty>(
            queryParams,
            query,
            config,
        );

        const model = this.facultiesViewModelFactory.initFacultyListViewModel(faculties);

        return new DataListResponse<FacultyViewModel>(model, count);
    }

    public async getFaculty(id: number): Promise<FacultyViewModel> {
        const faculty = await this.facultiesRepository.getById(id);

        if (!faculty) throw new NotFoundException(`Faculty not found.`);

        return this.facultiesViewModelFactory.initFacultyViewModel(faculty);
    }

    public async updateFaculty(
        id: number,
        updateFacultyDto: UpdateFacultyDto,
    ): Promise<FacultyViewModel> {
        await this.validateUpdate(id, updateFacultyDto);

        const faculty = await this.facultiesRepository.update(id, updateFacultyDto);

        return this.facultiesViewModelFactory.initFacultyViewModel(faculty);
    }

    public async deleteFaculty(id: number): Promise<void> {
        const faculty = await this.validateDelete(id);

        await this.facultiesRepository.deleteById(faculty.id);
    }

    private async validateCreate(dto: CreateFacultyDto): Promise<void> {
        await this.checkifNotExistByName(dto.name);
    }

    private async validateUpdate(id: number, dto: UpdateFacultyDto): Promise<void> {
        await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name, id);
    }

    private async validateDelete(id: number): Promise<Faculty> {
        return await this.checkifExist(id);
    }

    private async checkifNotExistByName(name: string, id?: number): Promise<void> {
        const faculty = await this.facultiesRepository.getByName(name);

        if (id && faculty && faculty.id === id) return;

        if (faculty) throw new ConflictException(`Faculty with name ${name} already exists.`);
    }

    private async checkifExist(id: number): Promise<Faculty> {
        const faculty = await this.facultiesRepository.getById(id);

        if (!faculty) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return faculty;
    }
}

interface IFacultiesService {
    createFaculty(dto: CreateFacultyDto): Promise<FacultyViewModel>;
    getFaculties(queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>>;
    getFaculty(id: number): Promise<FacultyViewModel>;
    updateFaculty(id: number, updateFacultyDto: UpdateFacultyDto): Promise<FacultyViewModel>;
}

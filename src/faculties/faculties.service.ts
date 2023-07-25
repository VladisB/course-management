import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { IFacultiesRepository } from "./faculties.repository";
import { Faculty } from "./entities/faculty.entity";
import { FacultyViewModel } from "./view-models";
import { FacultiesViewModelFactory, FacultyModelFactory } from "./model-factories";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension } from "@common/query-extention";
import { UpdateFacultyDto } from "./dto/update-faculty.dto";
import { BaseErrorMessage } from "@common/enum";
import { User } from "@app/users/entities/user.entity";

@Injectable()
export class FacultiesService implements IFacultiesService {
    constructor(
        private readonly facultiesRepository: IFacultiesRepository,
        private readonly facultiesViewModelFactory: FacultiesViewModelFactory,
    ) {}

    public async createFaculty(dto: CreateFacultyDto, user: User): Promise<FacultyViewModel> {
        await this.validateCreate(dto);

        const newEntity = FacultyModelFactory.create({
            name: dto.name,
            createdBy: user,
            createdAt: new Date(),
        });

        const faculty = await this.facultiesRepository.create(newEntity);

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

        if (!faculty) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.facultiesViewModelFactory.initFacultyViewModel(faculty);
    }

    public async updateFaculty(
        id: number,
        dto: UpdateFacultyDto,
        user: User,
    ): Promise<FacultyViewModel> {
        await this.validateUpdate(id, dto);

        const updatedEntity = FacultyModelFactory.update({
            id,
            name: dto.name,
            modifiedBy: user,
            modifiedAt: new Date(),
        });

        const faculty = await this.facultiesRepository.update(updatedEntity);

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
    createFaculty(dto: CreateFacultyDto, user: User): Promise<FacultyViewModel>;
    getFaculties(queryParams: QueryParamsDTO): Promise<DataListResponse<FacultyViewModel>>;
    getFaculty(id: number): Promise<FacultyViewModel>;
    updateFaculty(
        id: number,
        updateFacultyDto: UpdateFacultyDto,
        user: User,
    ): Promise<FacultyViewModel>;
}

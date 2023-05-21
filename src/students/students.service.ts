import { Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { StudentDetailsViewModel, StudentListViewModel } from "./view-models";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { IUsersRepository } from "src/users/users.repository";
import { User } from "src/users/entities/user.entity";
import { IRolesRepository } from "src/roles/roles.repository";
import { BaseErrorMessage } from "src/common/enum";
import { StudentsViewModelFactory } from "./model-factories";
import { ApplyToQueryExtension } from "src/common/query-extention";

@Injectable()
export class StudentsService implements IStudentsService {
    constructor(
        private readonly usersRepository: IUsersRepository,
        private readonly rolesRepository: IRolesRepository,
        private readonly studentsViewModelFactory: StudentsViewModelFactory,
    ) {}

    public async getAllStudents(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentListViewModel>> {
        const query = this.usersRepository.getAllStudentsQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "firstName",
                    prop: "first_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "email",
                    prop: "email",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "lastName",
                    prop: "last_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "courseId",
                    prop: "id",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "courseName",
                    prop: "name",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };

        const [users, count] = await ApplyToQueryExtension.applyToQuery<User>(
            queryParams,
            query,
            config,
        );

        const model = this.studentsViewModelFactory.initStudentListViewModel(users);

        return new DataListResponse<StudentListViewModel>(model, count);
    }

    public async getStudent(id: number): Promise<StudentDetailsViewModel> {
        const student = await this.usersRepository.getStudentById(id);

        if (!student) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.studentsViewModelFactory.initStudentDetailsViewModel(student);
    }
}

export abstract class IStudentsService {
    abstract getAllStudents(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentListViewModel>>;
    abstract getStudent(id: number): Promise<StudentDetailsViewModel>;
}

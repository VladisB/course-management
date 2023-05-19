import { Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { StudentViewModel } from "./view-models";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { IUsersRepository } from "src/users/users.repository";
import { User } from "src/users/entities/user.entity";
import { RoleName } from "src/roles/roles.enum";
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
    ): Promise<DataListResponse<StudentViewModel>> {
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
            ],
        };

        const [users, count] = await ApplyToQueryExtension.applyToQuery<User>(
            queryParams,
            query,
            config,
        );

        const model = this.studentsViewModelFactory.initStudentListViewModel(users);

        return new DataListResponse<StudentViewModel>(model, count);
    }

    public async getStudent(id: number): Promise<StudentViewModel> {
        const student = await this.getStudentEntity(id);

        if (!student) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.studentsViewModelFactory.initStudentViewModel(student);
    }

    private async getStudentEntity(id: number): Promise<User> {
        const role = await this.rolesRepository.getByName(RoleName.Student);

        return await this.usersRepository.getByIdAndRole(id, role.id);
    }
}

export abstract class IStudentsService {
    abstract getAllStudents(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentViewModel>>;
    abstract getStudent(id: number): Promise<StudentViewModel>;
}

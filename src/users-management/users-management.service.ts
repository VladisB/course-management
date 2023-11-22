import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { ApplyToQueryExtension } from "@common/query-extention";
import { BaseErrorMessage, RoleName } from "@common/enum";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { DataListResponse } from "@common/db/data-list-response";
import { Group } from "@app/groups/entities/group.entity";
import { IGroupsRepository } from "@app/groups/groups.repository";
import { IRolesRepository } from "@app/roles/roles.repository";
import { IStudentCoursesRepository } from "@app/student-courses/student-courses.repository";
import { IUsersRepository } from "@app/users/users.repository";
import { IUsersViewModelFactory } from "@app/users/model-factories";
import { QueryRunner } from "typeorm";
import { UpdateUserDto } from "@app/users/dto/update-user.dto";
import { User } from "@app/users/entities/user.entity";
import { UserViewModel } from "@app/users/view-models";
import { Role } from "@app/roles/entities/role.entity";
import { UserModelFactory } from "@app/users/model-factories/user.factory";
import { StudentCourseModelFactory } from "@app/student-courses/model-factories/student-course.factory";
import { AuthSignUpDto } from "@app/auth/dto";

@Injectable()
export class UsersManagementService implements IUsersManagementService {
    constructor(
        private rolesRepository: IRolesRepository,
        private studentCoursesRepository: IStudentCoursesRepository,
        private usersRepository: IUsersRepository,
        private groupsRepository: IGroupsRepository,
        private usersViewModelFactory: IUsersViewModelFactory,
    ) {}

    //#region Public methods
    public async signUpStudent(dto: AuthSignUpDto, user?: User): Promise<User> {
        const role = await this.validateSignUpStudent(dto);

        const transaction = await this.usersRepository.initTrx();

        try {
            const newEntity = UserModelFactory.create({
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role,
                group: null,
                createdBy: user ?? null,
                createdAt: new Date(),
            });

            const newUser = await this.usersRepository.trxCreate(transaction, newEntity);

            await this.usersRepository.commitTrx(transaction);

            return newUser;
        } catch (err) {
            console.error(err);

            await this.usersRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async createUser(dto: CreateUserDto, user: User): Promise<UserViewModel> {
        const [group, role] = await this.validateCreate(dto);

        const transaction = await this.usersRepository.initTrx();

        try {
            const newEntity = UserModelFactory.create({
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role,
                group,
                createdBy: user,
                createdAt: new Date(),
            });

            const newUser = await this.usersRepository.trxCreate(transaction, newEntity);

            if (group && role.name === RoleName.Student) {
                await this.trxAddStudentCourses(transaction, newUser, group, user);
            }

            await this.usersRepository.commitTrx(transaction);

            return this.usersViewModelFactory.initUserViewModel(newUser);
        } catch (err) {
            console.error(err);

            await this.usersRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async updateUser(id: number, dto: UpdateUserDto, user: User): Promise<UserViewModel> {
        const [group, userEntity, role] = await this.validateUpdate(id, dto);

        const transaction = await this.usersRepository.initTrx();

        try {
            await this.trxUpdateStudentCourses(transaction, group, userEntity, user);

            const updatedEntity = UserModelFactory.update({
                id,
                email: dto.email,
                password: dto.password,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role,
                group,
                modifiedBy: user,
                modifiedAt: new Date(),
            });

            const model = await this.usersRepository.trxUpdate(transaction, updatedEntity);

            await this.usersRepository.commitTrx(transaction);

            return this.usersViewModelFactory.initUserViewModel(model);
        } catch (err) {
            console.error(err);

            await this.usersRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    private async trxAddStudentCourses(
        transaction: QueryRunner,
        student: User,
        group: Group,
        createdBy: User,
    ) {
        if (group.groupCourses.length > 0) {
            const newEntityList = group.groupCourses.map((groupCourse) =>
                StudentCourseModelFactory.create({
                    course: groupCourse.course,
                    student: student,
                    createdAt: new Date(),
                    createdBy,
                }),
            );

            await this.studentCoursesRepository.trxBulkCreate(transaction, newEntityList);
        }
    }

    private async trxUpdateStudentCourses(
        transaction: QueryRunner,
        group: Group,
        user: User,
        createdBy: User,
    ) {
        if (group === undefined || group.groupCourses.length === 0) return;

        const currentStudentCourses = user.studentCourses;
        const newCourseIdList = group.groupCourses.map((gc) => gc.courseId);

        const newEntityList = group.groupCourses.map((groupCourse) =>
            StudentCourseModelFactory.create({
                course: groupCourse.course,
                student: user,
                createdAt: new Date(),
                createdBy,
            }),
        );

        if (currentStudentCourses.length === 0) {
            await this.studentCoursesRepository.trxBulkCreate(transaction, newEntityList);
        } else {
            // Compare with new courses
            const oldCourseIdList = currentStudentCourses.map((sc) => sc.courseId);

            const coursesIdListToAdd = newCourseIdList.filter(
                (id) => !oldCourseIdList.includes(id),
            );

            const entitiesToDelete = currentStudentCourses.filter(
                (sc) => !newCourseIdList.includes(sc.courseId),
            );

            // Remove courses that are not in new courses
            if (entitiesToDelete.length > 0) {
                await this.studentCoursesRepository.trxBulkDelete(
                    transaction,
                    entitiesToDelete.map((sc) => sc.id),
                );
            }

            // Add courses that are not in current courses
            if (coursesIdListToAdd.length > 0) {
                await this.studentCoursesRepository.trxBulkCreate(transaction, newEntityList);
            }
        }
    }

    public async getAllUsers(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<UserViewModel>> {
        const query = this.usersRepository.getAllQ();

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
                    name: "role",
                    prop: "name",
                    tableName: "role",
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

        const model = this.usersViewModelFactory.initUserListViewModel(users);

        return new DataListResponse<UserViewModel>(model, count);
    }

    public async getUser(id: number): Promise<UserViewModel> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException("User not found");

        return this.usersViewModelFactory.initUserViewModel(user);
    }

    public async deleteUser(id: number): Promise<void> {
        await this.validateDelete(id);

        await this.usersRepository.deleteById(id);
    }

    //#endregion

    //#region Private methods

    private async validateCreate(dto: CreateUserDto): Promise<readonly [Group, Role]> {
        await this.checkIfUserExistByEmail(dto.email);

        const role = dto.roleId
            ? await this.checkIfRoleExist(dto.roleId)
            : await this.rolesRepository.getByName(RoleName.Student);

        const group = dto.groupId && (await this.checkIfGroupNotExist(dto.groupId));

        return [group, role];
    }

    private async validateSignUpStudent(dto: AuthSignUpDto): Promise<Role> {
        await this.checkIfUserExistByEmail(dto.email);

        const role = await this.rolesRepository.getByName(RoleName.Student);

        return role;
    }

    private async validateUpdate(
        id: number,
        dto: UpdateUserDto,
    ): Promise<readonly [Group, User, Role]> {
        const user = await this.checkIfUserExistById(id);

        if (dto.email) {
            await this.checkIfUserExistByEmail(dto.email, id);
        }

        const group = dto.groupId && (await this.checkIfGroupNotExist(dto.groupId));
        const role = dto.roleId && (await this.checkIfRoleExist(dto.roleId));

        return [group, user, role];
    }

    private async validateDelete(id: number): Promise<void> {
        const user = await this.checkIfUserExistById(id);

        await this.validateStudent(user);
        await this.validateInstructor(user);
    }

    private async checkIfUserExistById(id: number): Promise<User> {
        const user = await this.usersRepository.getById(id);

        if (!user) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return user;
    }

    private async checkIfGroupNotExist(id: number): Promise<Group> {
        const group = await this.groupsRepository.getById(id);

        if (!group) throw new BadRequestException("Group not found");

        return group;
    }

    private async checkIfUserExistByEmail(email: string, id?: number): Promise<void> {
        const user = await this.usersRepository.getByEmail(email);

        if (id && user && user.id === id) return;

        if (user) throw new ConflictException("Email is already taken");
    }

    private async checkIfRoleExist(roleId: number): Promise<Role> {
        const role = await this.rolesRepository.getById(roleId);

        if (!role) throw new BadRequestException("Role not found");

        return role;
    }

    private async validateStudent(user: User): Promise<void> {
        if (this.checkIfUserIsStudent(user)) {
            const student = await this.usersRepository.getStudentCoursesByStudentId(user.id);

            if (student && student.studentCourses.length > 0) {
                throw new BadRequestException(
                    "Deleting student with courses is not allowed. Please remove courses first",
                );
            }
        }
    }

    private async validateInstructor(user: User): Promise<void> {
        if (this.checkIfUserIsInstructor(user)) {
            const instructor = await this.usersRepository.getInstructorCourses(user.id);

            if (instructor && instructor.courseInstructors.length > 0) {
                throw new BadRequestException(
                    "Deleting instructor with courses is not allowed. Please remove courses first",
                );
            }
        }
    }

    private async checkIfUserIsStudent(user: User): Promise<boolean> {
        return user.role.name !== RoleName.Student;
    }

    private async checkIfUserIsInstructor(user: User): Promise<boolean> {
        return user.role.name !== RoleName.Instructor;
    }

    //#endregion
}

export abstract class IUsersManagementService {
    abstract createUser(dto: CreateUserDto, user: User): Promise<UserViewModel>;
    abstract signUpStudent(dto: AuthSignUpDto, user?: User): Promise<User>;
    abstract deleteUser(id: number): Promise<void>;
    abstract getAllUsers(queryParams: QueryParamsDTO): Promise<DataListResponse<UserViewModel>>;
    abstract getUser(id: number): Promise<UserViewModel>;
    abstract updateUser(
        id: number,
        updateUserDto: UpdateUserDto,
        user: User,
    ): Promise<UserViewModel>;
}

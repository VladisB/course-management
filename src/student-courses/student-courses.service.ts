import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataListResponse } from "src/common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { RoleName } from "src/roles/roles.enum";
import { User } from "src/users/entities/user.entity";
import { Course } from "src/courses/entities/course.entity";
import { RolesRepository } from "src/roles/roles.repository";
import { UsersRepository } from "src/users/users.repository";
import { ICoursesRepository } from "src/courses/courses.repository";
import { CreateStudentCoursesDto } from "./dto/create-student-courses.dto";
import { UpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { StudentCoursesRepository } from "./student-courses.repository";
import { StudentCourses } from "./entities/student-courses.entity";
import { StudentCoursesViewModelFactory } from "./model-factories/student-courses";
import { StudentCoursesViewModel } from "./view-models";

@Injectable()
export class StudentCoursesService implements IStudentCoursesService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly studentCoursesRepository: StudentCoursesRepository,
        private readonly studentCoursesViewModelFactory: StudentCoursesViewModelFactory,
        private readonly usersRepository: UsersRepository,
    ) {}

    public async createStudentCourse(
        dto: CreateStudentCoursesDto,
    ): Promise<StudentCoursesViewModel> {
        const [strudent, course] = await this.validateCreate(dto);

        try {
            const studentCourse = await this.studentCoursesRepository.create(course, strudent);

            return this.studentCoursesViewModelFactory.initStudentCoursesViewModel(studentCourse);
        } catch (err) {
            console.error(err);

            throw err;
        }
    }

    public async getStudentCourse(id: number): Promise<StudentCoursesViewModel> {
        const studentCourse = await this.studentCoursesRepository.getById(id);

        if (!studentCourse) throw new NotFoundException();

        return this.studentCoursesViewModelFactory.initStudentCoursesViewModel(studentCourse);
    }

    public async getStudentCourses(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentCoursesViewModel>> {
        const query = this.studentCoursesRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "student_courses",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentId",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentName",
                    prop: "first_name",
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

        const [studentCourses, count] = await ApplyToQueryExtension.applyToQuery<StudentCourses>(
            queryParams,
            query,
            config,
        );

        const model =
            this.studentCoursesViewModelFactory.initStudentCoursesListViewModel(studentCourses);

        return new DataListResponse<StudentCoursesViewModel>(model, count);
    }

    public async updateStudentCourse(
        id: number,
        dto: UpdateStudentCoursesDto,
    ): Promise<StudentCoursesViewModel> {
        await this.validateUpdate(id);

        try {
            const studentCourse = await this.studentCoursesRepository.update(id, dto);

            return this.studentCoursesViewModelFactory.initStudentCoursesViewModel(studentCourse);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async deleteUpdateStudentCourse(id: number): Promise<void> {
        const studentCourse = await this.validateDelete(id);
        await this.studentCoursesRepository.deleteById(studentCourse.id);
    }

    private async validateCreate(dto: CreateStudentCoursesDto): Promise<readonly [User, Course]> {
        const student = await this.checkIfStudentExist(dto.studentId);
        const course = await this.checkifCourseExist(dto.courseId);
        await this.checkIfExist(course, student);

        return [student, course];
    }

    private async validateUpdate(id: number): Promise<StudentCourses> {
        return await this.checkifNotExist(id);
    }

    private async validateDelete(id: number): Promise<StudentCourses> {
        return await this.checkifNotExist(id);
    }

    private async checkIfStudentExist(studentId: number): Promise<User> {
        if (!studentId) return;

        const studentRole = await this.rolesRepository.getByName(RoleName.Student);
        const student = await this.usersRepository.getByIdAndRole(studentId, studentRole.id);

        if (!student) throw new NotFoundException(`Student not found.`);

        return student;
    }

    private async checkifCourseExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException(`Course not found.`);

        return course;
    }

    private async checkIfExist(course: Course, student: User): Promise<void> {
        const studentCourse = await this.studentCoursesRepository.getByCourseAndStudent(
            course,
            student,
        );

        if (studentCourse) throw new ConflictException(`User course already exist.`);
    }

    private async checkifNotExist(id: number): Promise<StudentCourses> {
        const studentCourse = await this.studentCoursesRepository.getById(id);

        if (!studentCourse) throw new ConflictException(`Student course not found.`);

        return studentCourse;
    }
}

interface IStudentCoursesService {
    createStudentCourse(dto: CreateStudentCoursesDto): Promise<StudentCoursesViewModel>;
    deleteUpdateStudentCourse(id: number): Promise<void>;
    getStudentCourse(id: number): Promise<StudentCoursesViewModel>;
    getStudentCourses(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<StudentCoursesViewModel>>;
    updateStudentCourse(id: number, dto: UpdateStudentCoursesDto): Promise<StudentCoursesViewModel>;
}

import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension } from "@common/query-extention";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { Course } from "@app/courses/entities/course.entity";
import { CreateStudentCoursesDto } from "./dto/create-student-courses.dto";
import { UpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { StudentCourses } from "./entities/student-courses.entity";
import { StudentCoursesViewModelFactory } from "./model-factories/student-courses";
import { IStudentCoursesRepository } from "./student-courses.repository";
import { StudentCoursesViewModel } from "./view-models";
import { IUsersRepository } from "@app/users/users.repository";
import { User } from "@app/users/entities/user.entity";
import { BaseErrorMessage } from "@common/enum";

@Injectable()
export class StudentCoursesService implements IStudentCoursesService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly studentCoursesRepository: IStudentCoursesRepository,
        private readonly studentCoursesViewModelFactory: StudentCoursesViewModelFactory,
        private readonly usersRepository: IUsersRepository,
    ) {}

    public async createStudentCourse(
        dto: CreateStudentCoursesDto,
    ): Promise<StudentCoursesViewModel> {
        const [strudent, course] = await this.validateCreate(dto);

        try {
            const studentCourse = await this.studentCoursesRepository.create(
                course.id,
                strudent.id,
            );

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

        const studentCourse = await this.studentCoursesRepository.update(id, dto);

        return this.studentCoursesViewModelFactory.initStudentCoursesViewModel(studentCourse);
    }

    public async deleteUpdateStudentCourse(id: number): Promise<void> {
        const studentCourse = await this.validateDelete(id);
        await this.studentCoursesRepository.deleteById(studentCourse.id);
    }

    private async validateCreate(dto: CreateStudentCoursesDto): Promise<readonly [User, Course]> {
        const student = await this.checkIfStudentExist(dto.studentId);
        const course = await this.checkifCourseExist(dto.courseId);
        await this.checkIfExist(course.id, student.id);

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

        const student = await this.usersRepository.getStudentById(studentId);

        if (!student) throw new BadRequestException(`Student not found.`);

        return student;
    }

    private async checkifCourseExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new BadRequestException(`Provided course not found.`);

        return course;
    }

    private async checkIfExist(courseId: number, studentId: number): Promise<void> {
        const studentCourse = await this.studentCoursesRepository.getByCourseAndStudent(
            courseId,
            studentId,
        );

        if (studentCourse) throw new ConflictException(`User course already exist.`);
    }

    private async checkifNotExist(id: number): Promise<StudentCourses> {
        const studentCourse = await this.studentCoursesRepository.getById(id);

        if (!studentCourse) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

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

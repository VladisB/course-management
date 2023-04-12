import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CourseViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { CoursesRepository } from "./courses.repository";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";
import { UsersRepository } from "src/users/users.repository";
import { RoleName } from "src/roles/roles.enum";
import { User } from "src/users/entities/user.entity";
import { RolesRepository } from "src/roles/roles.repository";
import { CourseInstructorsRepository } from "./course-instructors.repository";

@Injectable()
export class CoursesService implements ICoursesService {
    constructor(
        private readonly coursesRepository: CoursesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly courseInstructorsRepository: CourseInstructorsRepository,
        private readonly coursesViewModelFactory: CoursesViewModelFactory,
    ) {}

    public async createCourse(dto: CreateCourseDto): Promise<CourseViewModel> {
        const istructors = await this.validateCreate(dto);

        const transaction = await this.coursesRepository.initTrx();

        try {
            const course = await this.coursesRepository.trxCreate(transaction, dto);

            await this.courseInstructorsRepository.trxBulkCreate(transaction, course, istructors);

            await this.coursesRepository.commitTrx(transaction);

            return this.coursesViewModelFactory.initCourseViewModel(course);
        } catch (err) {
            console.error(err);

            await this.coursesRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async getCourses(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseViewModel>> {
        const coursesQuery = this.coursesRepository.getAllQ();

        const coursesConfig = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [courses, count] = await ApplyToQueryExtension.applyToQuery<Course>(
            queryParams,
            coursesQuery,
            coursesConfig,
        );

        const model = this.coursesViewModelFactory.initCourseListViewModel(courses);

        return new DataListResponse<CourseViewModel>(model, count);
    }

    public async getCourse(id: number): Promise<CourseViewModel> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException(`Course not found.`);

        return this.coursesViewModelFactory.initCourseViewModel(course);
    }

    public async updateCourse(
        id: number,
        updateCourseDto: UpdateCourseDto,
    ): Promise<CourseViewModel> {
        const instructors = await this.validateUpdate(id, updateCourseDto);

        const transaction = await this.coursesRepository.initTrx();

        try {
            const course = await this.coursesRepository.trxUpdate(transaction, id, updateCourseDto);

            const courseInstructors = await this.courseInstructorsRepository.trxGetAllByCourseId(
                transaction,
                course.id,
            );

            await this.courseInstructorsRepository.trxDeleteByIdList(
                transaction,
                courseInstructors.map((ci) => ci.id),
            );

            await this.courseInstructorsRepository.trxBulkCreate(transaction, course, instructors);

            await this.coursesRepository.commitTrx(transaction);

            return this.coursesViewModelFactory.initCourseViewModel(course);
        } catch (err) {
            console.error(err);

            await this.coursesRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async deleteCourse(id: number): Promise<void> {
        const Course = await this.validateDelete(id);

        await this.coursesRepository.deleteById(Course.id);
    }

    private async validateCreate(dto: CreateCourseDto): Promise<User[]> {
        await this.checkifNotExistByName(dto.name);

        return await this.checkIfInstructorsExists(dto.instructorIdList);
    }

    private async validateUpdate(id: number, dto: UpdateCourseDto): Promise<User[]> {
        await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name, id);

        return await this.checkIfInstructorsExists(dto.instructorIdList);
    }

    private async validateDelete(id: number): Promise<Course> {
        return await this.checkifExist(id);
    }

    private async checkIfInstructorsExists(instructorIdList: number[]): Promise<User[]> {
        if (!instructorIdList?.length) return [];

        const instructorRole = await this.rolesRepository.getByName(RoleName.Instructor);
        const instructors = await this.usersRepository.getByIdList(
            instructorIdList,
            instructorRole.id,
        );

        if (instructors.length !== instructorIdList.length)
            throw new NotFoundException(`Some of the instructors not found.`);

        return instructors;
    }

    private async checkifNotExistByName(name: string, id?: number): Promise<void> {
        const course = await this.coursesRepository.getByName(name);

        if (id && course && course.id === id) return;

        if (course) throw new ConflictException(`Course with name ${name} already exists.`);
    }

    private async checkifExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException();

        return course;
    }
}

interface ICoursesService {
    createCourse(dto: CreateCourseDto): Promise<CourseViewModel>;
    getCourse(id: number): Promise<CourseViewModel>;
    getCourses(queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>>;
    updateCourse(id: number, updateCourseDto: UpdateCourseDto): Promise<CourseViewModel>;
}

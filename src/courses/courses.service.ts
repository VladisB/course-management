import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CourseViewModel } from "./view-models";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension } from "@common/query-extention";
import { ICoursesRepository } from "./courses.repository";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";
import { BaseErrorMessage } from "@app/common/enum";
import { CourseModelFactory } from "./model-factories/course.factory";
import { User } from "@app/users/entities/user.entity";

@Injectable()
export class CoursesService implements ICoursesService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly coursesViewModelFactory: CoursesViewModelFactory,
    ) {}

    public async createCourse(dto: CreateCourseDto, user: User): Promise<CourseViewModel> {
        await this.validateCreate(dto);

        const newEntity = CourseModelFactory.create({
            name: dto.name,
            createdBy: user,
            createdAt: new Date(),
        });

        const course = await this.coursesRepository.create(newEntity);

        return this.coursesViewModelFactory.initCourseViewModel(course);
    }

    public async getCourses(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseViewModel>> {
        const query = this.coursesRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "name",
                    prop: "name",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "instructorId",
                    prop: "instructorId",
                    tableName: "courseInstructors",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
            ],
        };

        const [courses, count] = await ApplyToQueryExtension.applyToQuery<Course>(
            queryParams,
            query,
            config,
        );

        const model = this.coursesViewModelFactory.initCourseListViewModel(courses);

        return new DataListResponse<CourseViewModel>(model, count);
    }

    public async getCourse(id: number): Promise<CourseViewModel> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.coursesViewModelFactory.initCourseViewModel(course);
    }

    public async updateCourse(
        id: number,
        dto: UpdateCourseDto,
        user: User,
    ): Promise<CourseViewModel> {
        await this.validateUpdate(id, dto);

        const updatedEntity = CourseModelFactory.update({
            id,
            name: dto.name,
            modifiedBy: user,
            modifiedAt: new Date(),
        });

        const course = await this.coursesRepository.update(updatedEntity);

        return this.coursesViewModelFactory.initCourseViewModel(course);
    }

    public async deleteCourse(id: number): Promise<void> {
        await this.validateDelete(id);

        await this.coursesRepository.deleteById(id);
    }

    private async validateCreate(dto: CreateCourseDto): Promise<void> {
        await this.checkifNotExistByName(dto.name);
    }

    private async validateUpdate(id: number, dto: UpdateCourseDto): Promise<void> {
        await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name, id);
    }

    private async validateDelete(id: number): Promise<void> {
        await this.checkifExist(id);
        await this.checkIfCourseHasInstructor(id);
        await this.checkIfCourseHasGroup(id);
        await this.checkIfCourseHasStudents(id);
        await this.checkIfCourseHasLessons(id);
    }

    private async checkifNotExistByName(name: string, id?: number): Promise<void> {
        const course = await this.coursesRepository.getByName(name);

        if (id && course && course.id === id) return;

        if (course) throw new ConflictException(`Course with name ${name} already exists.`);
    }

    private async checkifExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return course;
    }

    private async checkIfCourseHasInstructor(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (course.courseInstructors.length > 0) {
            throw new ConflictException(
                `Course with id ${id} has instructor. Please remove instructor first.`,
            );
        }

        return course;
    }

    private async checkIfCourseHasGroup(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (course.groupCourses.length > 0) {
            throw new ConflictException(
                `Course with id ${id} has group. Please remove or reassign group first.`,
            );
        }

        return course;
    }

    private async checkIfCourseHasStudents(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (course.studentCourses.length > 0) {
            throw new ConflictException(
                `Course with id ${id} has student. Please remove or reassign student first.`,
            );
        }

        return course;
    }

    private async checkIfCourseHasLessons(id: number): Promise<void> {
        const lessons = await this.coursesRepository.getLessonsNumberByCourseId(id);

        if (lessons > 0) {
            throw new ConflictException(
                `Course with id ${id} has lessons. Please remove or reassign lessons first.`,
            );
        }
    }
}

interface ICoursesService {
    createCourse(dto: CreateCourseDto, user: User): Promise<CourseViewModel>;
    getCourse(id: number): Promise<CourseViewModel>;
    getCourses(queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>>;
    updateCourse(
        id: number,
        updateCourseDto: UpdateCourseDto,
        user: User,
    ): Promise<CourseViewModel>;
}

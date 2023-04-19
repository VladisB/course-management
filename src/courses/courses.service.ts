import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CourseViewModel } from "./view-models";
import { DataListResponse } from "src/common/db/data-list-response";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { ICoursesRepository } from "./courses.repository";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";

@Injectable()
export class CoursesService implements ICoursesService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly coursesViewModelFactory: CoursesViewModelFactory,
    ) {}

    public async createCourse(dto: CreateCourseDto): Promise<CourseViewModel> {
        await this.validateCreate(dto);

        const transaction = await this.coursesRepository.initTrx();

        try {
            const course = await this.coursesRepository.trxCreate(transaction, dto);

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

    public async updateCourse(id: number, dto: UpdateCourseDto): Promise<CourseViewModel> {
        await this.validateUpdate(id, dto);

        const course = await this.coursesRepository.update(id, dto);

        return this.coursesViewModelFactory.initCourseViewModel(course);
    }

    public async deleteCourse(id: number): Promise<void> {
        const Course = await this.validateDelete(id);

        await this.coursesRepository.deleteById(Course.id);
    }

    private async validateCreate(dto: CreateCourseDto): Promise<void> {
        await this.checkifNotExistByName(dto.name);
    }

    private async validateUpdate(id: number, dto: UpdateCourseDto): Promise<void> {
        await this.checkifExist(id);
        await this.checkifNotExistByName(dto.name, id);
    }

    private async validateDelete(id: number): Promise<Course> {
        return await this.checkifExist(id);
        // TODO: Check if course is not used in any other entity. Check Instructors and Students.
        // TODO: Check if course has any lessons.
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

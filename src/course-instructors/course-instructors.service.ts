import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { RolesRepository } from "src/roles/roles.repository";
import { CourseInstructorsRepository } from "./course-instructors.repository";
import { CreateCourseInstructorsDto } from "./dto/create-course-instructors.dto";
import { UsersRepository } from "src/users/users.repository";
import { CourseInstructorsViewModelFactory } from "./model-factories";
import { CourseInstructorsViewModel } from "./view-models";
import { RoleName } from "src/roles/roles.enum";
import { Course } from "src/courses/entities/course.entity";
import { ICoursesRepository } from "src/courses/courses.repository";
import { CourseInstructors } from "src/courses/entities/course-to-instructor.entity";
import { QueryParamsDTO } from "src/common/dto/query-params.dto";
import { DataListResponse } from "src/common/db/data-list-response";
import { ApplyToQueryExtension } from "src/common/query-extention";

@Injectable()
export class CourseInstructorsService implements ICourseInstructorsService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly courseInstructorsRepository: CourseInstructorsRepository,
        private readonly courseInstructorsViewModelFactory: CourseInstructorsViewModelFactory,
    ) {}

    public async createCourseInstructors(
        dto: CreateCourseInstructorsDto,
    ): Promise<CourseInstructorsViewModel> {
        await this.validateCreate(dto);

        const courseInstructors = await this.courseInstructorsRepository.bulkCreate(
            dto.courseId,
            dto.instructorIdList,
        );

        return this.courseInstructorsViewModelFactory.initCourseInstructorsViewModel(
            courseInstructors,
        );
    }

    public async getCourseInstructors(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsViewModel>> {
        const query = this.courseInstructorsRepository.getAllQ();
        // TODO: fix search by id
        const config = {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "course_instructors",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "courseName",
                    prop: "name",
                    tableName: "course",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "instructorId",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "instructorName",
                    prop: "first_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
                {
                    name: "instructorLastName",
                    prop: "last_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                },
            ],
        };

        const [courses, count] = await ApplyToQueryExtension.applyToQuery<CourseInstructors>(
            queryParams,
            query,
            config,
        );

        const model =
            this.courseInstructorsViewModelFactory.initCourseInstructorsListViewModel(courses);

        return new DataListResponse<CourseInstructorsViewModel>(model, count);
    }

    // public async getCourse(id: number): Promise<CourseViewModel> {
    //     const course = await this.coursesRepository.getById(id);

    //     if (!course) throw new NotFoundException(`Course not found.`);

    //     return this.coursesViewModelFactory.initCourseViewModel(course);
    // }

    public async deleteCourseInstructors(id: number): Promise<void> {
        const courseInstructors = await this.validateDelete(id);

        await this.courseInstructorsRepository.deleteById(courseInstructors.id);
    }

    private async validateCreate(dto: CreateCourseInstructorsDto): Promise<void> {
        await this.checkIfInstructorsExists(dto.instructorIdList);
        await this.checkifCourseExist(dto.courseId);
        await this.checkIfExistsByDetails(dto.instructorIdList, dto.courseId);
    }

    private async validateDelete(id: number): Promise<CourseInstructors> {
        return await this.checkIfExists(id);
    }

    private async checkIfExistsByDetails(
        instructorIdList: number[],
        courseId: number,
    ): Promise<void> {
        const corseInstructors = await this.courseInstructorsRepository.getByDetails(
            instructorIdList,
            courseId,
        );

        corseInstructors.forEach((assigment) => {
            if (instructorIdList.includes(assigment.instructorId))
                throw new ConflictException(
                    `Instructor ${assigment.instructor.lastName} is already assigned.`,
                );
        });
    }

    private async checkIfExists(id: number): Promise<CourseInstructors> {
        const corseInstructors = await this.courseInstructorsRepository.getById(id);

        if (!corseInstructors) throw new NotFoundException();

        return corseInstructors;
    }

    private async checkIfInstructorsExists(instructorIdList: number[]): Promise<User[]> {
        if (!instructorIdList?.length) return [];

        const instructorRole = await this.rolesRepository.getByName(RoleName.Instructor);
        const instructors = await this.usersRepository.getByIdList(
            instructorIdList,
            instructorRole.id,
        );

        if (instructors.length !== instructorIdList.length)
            throw new ConflictException(`Some of the instructors not found.`);

        return instructors;
    }

    private async checkifCourseExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new NotFoundException();

        return course;
    }

    // private async checkifCourseInstructorsExist(id: number): Promise<Course> {
    //     const courseInstructors = await this.courseInstructorsRepository.getById(id);

    //     if (!course) throw new NotFoundException();

    //     return course;
    // }
}

interface ICourseInstructorsService {
    createCourseInstructors(dto: CreateCourseInstructorsDto): Promise<CourseInstructorsViewModel>;
    deleteCourseInstructors(id: number): Promise<void>;
    getCourseInstructors(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsViewModel>>;
    // getCourse(id: number): Promise<CourseViewModel>;
    // getCourses(queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>>;
    // updateCourse(id: number, updateCourseDto: UpdateCourseDto): Promise<CourseViewModel>;
}

import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
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

    // public async getCourses(
    //     queryParams: QueryParamsDTO,
    // ): Promise<DataListResponse<CourseViewModel>> {
    //     const coursesQuery = this.coursesRepository.getAllQ();

    //     const coursesConfig = {
    //         columns: [
    //             {
    //                 name: "id",
    //                 prop: "id",
    //                 tableName: "course",
    //                 isSearchable: true,
    //                 isSortable: true,
    //             },
    //             {
    //                 name: "name",
    //                 prop: "name",
    //                 tableName: "course",
    //                 isSearchable: true,
    //                 isSortable: true,
    //             },
    //         ],
    //     };

    //     const [courses, count] = await ApplyToQueryExtension.applyToQuery<Course>(
    //         queryParams,
    //         coursesQuery,
    //         coursesConfig,
    //     );

    //     const model = this.coursesViewModelFactory.initCourseListViewModel(courses);

    //     return new DataListResponse<CourseViewModel>(model, count);
    // }

    // public async getCourse(id: number): Promise<CourseViewModel> {
    //     const course = await this.coursesRepository.getById(id);

    //     if (!course) throw new NotFoundException(`Course not found.`);

    //     return this.coursesViewModelFactory.initCourseViewModel(course);
    // }

    // public async deleteCourse(id: number): Promise<void> {
    //     const Course = await this.validateDelete(id);

    //     await this.coursesRepository.deleteById(Course.id);
    // }

    private async validateCreate(dto: CreateCourseInstructorsDto): Promise<void> {
        await this.checkIfInstructorsExists(dto.instructorIdList);
        await this.checkifCourseExist(dto.courseId);
    }

    // private async validateDelete(id: number): Promise<Course> {
    //     return await this.checkifExist(id);
    // }

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
    // getCourse(id: number): Promise<CourseViewModel>;
    // getCourses(queryParams: QueryParamsDTO): Promise<DataListResponse<CourseViewModel>>;
    // updateCourse(id: number, updateCourseDto: UpdateCourseDto): Promise<CourseViewModel>;
}

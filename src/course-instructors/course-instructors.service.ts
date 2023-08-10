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
import { IRolesRepository } from "@app/roles/roles.repository";
import { User } from "@app/users/entities/user.entity";
import { IUsersRepository } from "@app/users/users.repository";
import { ICourseInstructorsRepository } from "./course-instructors.repository";
import { CreateCourseInstructorsDto } from "./dto/create-course-instructors.dto";
import { PUTUpdateCourseInstructorsDto } from "./dto/put-update-course-instructors.dto";
import { CourseInstructorModelFactory, CourseInstructorsViewModelFactory } from "./model-factories";
import {
    CourseInstructorViewModel,
    CourseInstructorsListViewModel,
    CourseInstructorsViewModel,
} from "./view-models";
import { BaseErrorMessage, RoleName } from "@common/enum";
import { CourseInstructors } from "./entities/course-instructors.entity";

@Injectable()
export class CourseInstructorsService implements ICourseInstructorsService {
    constructor(
        private readonly coursesRepository: ICoursesRepository,
        private readonly usersRepository: IUsersRepository,
        private readonly rolesRepository: IRolesRepository,
        private readonly courseInstructorsRepository: ICourseInstructorsRepository,
        private readonly courseInstructorsViewModelFactory: CourseInstructorsViewModelFactory,
    ) {}

    public async createCourseInstructors(
        dto: CreateCourseInstructorsDto,
        user: User,
    ): Promise<CourseInstructorsViewModel> {
        const [instructors, course] = await this.validateCreate(dto);

        const newEntities = instructors.map((instructor) =>
            CourseInstructorModelFactory.create({
                course,
                instructor,
                createdAt: new Date(),
                createdBy: user,
            }),
        );

        const courseInstructors = await this.courseInstructorsRepository.bulkCreate(newEntities);

        return this.courseInstructorsViewModelFactory.initCourseInstructorsViewModel(
            courseInstructors,
        );
    }

    public async getCourseInstructors(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsListViewModel>> {
        const query = this.courseInstructorsRepository.getAllQ();

        const config = {
            columns: [
                {
                    name: "courseInstructorId",
                    prop: "id",
                    tableName: "course_instructors",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
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
                {
                    name: "instructorId",
                    prop: "id",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "instructorName",
                    prop: "first_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "instructorLastName",
                    prop: "last_name",
                    tableName: "user",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
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

        return new DataListResponse<CourseInstructorsListViewModel>(model, count);
    }

    public async getCourseInstructor(id: number): Promise<CourseInstructorViewModel> {
        const courseInstructor = await this.courseInstructorsRepository.getById(id);

        if (!courseInstructor) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

        return this.courseInstructorsViewModelFactory.initCourseInstructorViewModel(
            courseInstructor,
        );
    }

    public async updateCourseInstructors(
        id: number,
        dto: PUTUpdateCourseInstructorsDto,
        user: User,
    ): Promise<CourseInstructorsViewModel> {
        const [instructors, course] = await this.validateUpdate(id, dto);

        const transaction = await this.courseInstructorsRepository.initTrx();

        try {
            const courseInstructors = await this.courseInstructorsRepository.trxGetAllByCourseId(
                transaction,
                dto.courseId,
            );

            await this.courseInstructorsRepository.trxDeleteByIdList(
                transaction,
                courseInstructors.map((cInstructor) => cInstructor.id),
            );

            const newEntities = instructors.map((instructor) =>
                CourseInstructorModelFactory.create({
                    course,
                    instructor,
                    createdAt: new Date(),
                    createdBy: user,
                }),
            );

            await this.courseInstructorsRepository.trxBulkCreate(transaction, newEntities);

            await this.courseInstructorsRepository.commitTrx(transaction);

            return this.courseInstructorsViewModelFactory.initCourseInstructorsViewModel(
                courseInstructors,
            );
        } catch (err) {
            console.error(err);

            await this.courseInstructorsRepository.rollbackTrx(transaction);

            throw err;
        }
    }

    public async deleteCourseInstructors(id: number): Promise<void> {
        const courseInstructors = await this.validateDelete(id);

        await this.courseInstructorsRepository.deleteById(courseInstructors.id);
    }

    private async validateCreate(
        dto: CreateCourseInstructorsDto,
    ): Promise<readonly [User[], Course]> {
        const instructors = await this.checkIfInstructorsExists(dto.instructorIdList);
        const course = await this.checkifCourseExist(dto.courseId);
        await this.checkIfExistsByDetails(dto.instructorIdList, dto.courseId);

        return [instructors, course];
    }

    private async validateDelete(id: number): Promise<CourseInstructors> {
        const courseInstructors = await this.checkIfExists(id);
        await this.checkIfCoursesHaveInstructors(courseInstructors);

        return courseInstructors;
    }

    private async validateUpdate(
        id: number,
        dto: PUTUpdateCourseInstructorsDto,
    ): Promise<readonly [User[], Course]> {
        await this.checkIfExists(id);
        const instructors = await this.checkIfInstructorsExists(dto.instructorIdList);
        const course = await this.checkifCourseExist(dto.courseId);

        return [instructors, course];
    }

    private async checkIfCoursesHaveInstructors(
        courseInstructors: CourseInstructors,
    ): Promise<void> {
        const isCourseAssigned = await this.coursesRepository.isAssignedToGroup(
            courseInstructors.courseId,
        );

        if (courseInstructors.course.courseInstructors.length === 1 && isCourseAssigned)
            throw new ConflictException(`Assigned course should have at least one instructor.`);
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
        const corseInstructors = await this.courseInstructorsRepository.getByIdWithFullDetails(id);

        if (!corseInstructors) throw new NotFoundException(BaseErrorMessage.NOT_FOUND);

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
            throw new BadRequestException(`Some of the instructors not found.`);

        return instructors;
    }

    private async checkifCourseExist(id: number): Promise<Course> {
        const course = await this.coursesRepository.getById(id);

        if (!course) throw new BadRequestException(`Provided course not found.`);

        return course;
    }
}

interface ICourseInstructorsService {
    createCourseInstructors(
        dto: CreateCourseInstructorsDto,
        user: User,
    ): Promise<CourseInstructorsViewModel>;
    deleteCourseInstructors(id: number): Promise<void>;
    getCourseInstructors(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<CourseInstructorsListViewModel>>;
    getCourseInstructor(id: number): Promise<CourseInstructorViewModel>;
    updateCourseInstructors(
        id: number,
        dto: PUTUpdateCourseInstructorsDto,
        user: User,
    ): Promise<CourseInstructorsViewModel>;
}

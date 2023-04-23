import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseErrorMessages } from "src/common/db/enum";
import { Course } from "src/courses/entities/course.entity";
import { User } from "src/users/entities/user.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { StudentCourses } from "./entities/student-courses.entity";
import { UpdateStudentCoursesDto } from "./dto/update-student-courses.dto";
import { BaseRepository, IBaseRepository } from "src/common/db/base.repository";

@Injectable()
export class StudentCoursesRepository extends BaseRepository implements IStudentCoursesRepository {
    private readonly tableName = "student_courses";

    constructor(
        @InjectRepository(StudentCourses)
        private readonly entityRepository: Repository<StudentCourses>,
    ) {
        super(entityRepository.manager.queryRunner);
    }

    public async create(course: Course, student: User): Promise<StudentCourses> {
        try {
            const feedBack = this.entityRepository.create({
                course,
                student,
            });

            const { id } = await this.entityRepository.save(feedBack);

            return await this.getById(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }

    public async update(id: number, dto: UpdateStudentCoursesDto): Promise<StudentCourses> {
        try {
            const feedBack = await this.entityRepository.preload({
                id,
                ...dto,
                feedback: dto.feedBack,
            });

            return await this.entityRepository.save(feedBack);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }

    public async getById(id: number): Promise<StudentCourses> {
        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<StudentCourses> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .innerJoinAndSelect("student_courses.course", "course")
            .innerJoinAndSelect("student_courses.student", "user");

        return userQuery;
    }

    public async getByCourseAndStudent(course: Course, student: User): Promise<StudentCourses> {
        return await this.entityRepository.findOne({
            where: {
                course: { id: course.id },
                student: { id: student.id },
            },
            relations: {
                course: true,
                student: true,
            },
        });
    }

    public async deleteById(id: number): Promise<void> {
        try {
            await this.entityRepository.delete(id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessages.DB_ERROR);
        }
    }
}

export abstract class IStudentCoursesRepository extends IBaseRepository {
    abstract create(course: Course, instructor: User): Promise<StudentCourses>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): any;
    abstract getByCourseAndStudent(course: Course, student: User): Promise<StudentCourses>;
    abstract getById(id: number): Promise<StudentCourses>;
    abstract update(id: number, dto: UpdateStudentCoursesDto): Promise<StudentCourses>;
}

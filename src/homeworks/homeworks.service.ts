import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { UpdateHomeworkDto } from "./dto/update-homework.dto";
import { User } from "src/users/entities/user.entity";
import { IHomeworksRepository } from "./homeworks.repository";
import { HomeworkViewModelFactory } from "./model-factories";
import { HomeworkViewModel } from "./view-models";
import { ILessonsRepository } from "src/lessons/lessons.repository";
import { IUsersRepository } from "src/users/users.repository";
import { Lesson } from "src/lessons/entities/lesson.entity";

@Injectable()
export class HomeWorksService implements IHomeWorksService {
    constructor(
        private readonly homeworkViewModelFactory: HomeworkViewModelFactory,
        private readonly homeworksRepository: IHomeworksRepository,
        private readonly lessonsRepository: ILessonsRepository,
        private readonly usersRepository: IUsersRepository,
    ) {}

    public async createHomework(dto: CreateHomeworkDto, creator: User): Promise<HomeworkViewModel> {
        await this.validateCreate(dto, creator.id);

        const homework = await this.homeworksRepository.create(dto, creator.id);

        return this.homeworkViewModelFactory.initHomeworkViewModel(homework);
    }

    private async validateCreate(dto: CreateHomeworkDto, studentId: number): Promise<void> {
        await this.checkIfExists(dto.lessonId, studentId);
        await this.checkIfLessonExists(dto.lessonId);
        await this.checkIfStudentExists(studentId);
    }

    private async checkIfExists(lessonId: number, studentId: number): Promise<void> {
        const homework = await this.homeworksRepository.getByLesson(lessonId, studentId);

        if (homework) {
            throw new ConflictException(`Homework already exists`);
        }
    }

    private async checkIfLessonExists(id: number): Promise<Lesson> {
        const lesson = await this.lessonsRepository.getById(id);

        if (!lesson) {
            throw new BadRequestException("Provided lesson not found");
        }

        return lesson;
    }

    private async checkIfStudentExists(id: number): Promise<User> {
        const student = await this.usersRepository.getStudentById(id);

        if (!student) {
            throw new BadRequestException("Provided student not found");
        }

        return student;
    }
}

export abstract class IHomeWorksService {
    abstract createHomework(dto: CreateHomeworkDto, creator: User): Promise<HomeworkViewModel>;
    // abstract deleteGrade(id: number): Promise<void>;
    // abstract getAllGrades(
    //     queryParams: QueryParamsDTO,
    // ): Promise<DataListResponse<LessonGradeViewModel>>;
    // abstract getGrade(id: number): Promise<LessonGradeViewModel>;
    // abstract updateGrade(
    //     id: number,
    //     dto: UpdateLessonGradeDto,
    //     modifiedBy: User,
    // ): Promise<LessonGradeViewModel>;
}

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
import { IFilesService } from "src/files/files.service.interface";
import { FileMimeType, S3BucketPath } from "src/common/enum";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HomeWorksService implements IHomeWorksService {
    constructor(
        private readonly homeworkViewModelFactory: HomeworkViewModelFactory,
        private readonly homeworksRepository: IHomeworksRepository,
        private readonly lessonsRepository: ILessonsRepository,
        private readonly usersRepository: IUsersRepository,
        private readonly filesService: IFilesService,
        private readonly configService: ConfigService,
    ) {}

    public async createHomework(
        dto: CreateHomeworkDto,
        file: Buffer,
        fileName: string,
        creator: User,
    ): Promise<HomeworkViewModel> {
        const lesson = await this.validateCreate(dto, creator.id);

        const fullName = `${creator.firstName} ${creator.lastName}`;
        const objecKey = await this.uploadHomework(
            file,
            creator,
            lesson.course.name,
            fullName,
            dto.lessonId,
        );

        const homework = await this.homeworksRepository.create(dto, objecKey, creator.id);

        return this.homeworkViewModelFactory.initHomeworkViewModel(homework);
    }

    private async uploadHomework(
        fileContent: Buffer,
        creator: User,
        courseName: string,
        studentName: string,
        lessonId: number,
    ): Promise<string> {
        const fileName = this.setFileName(courseName, studentName, lessonId);
        const objectKey = `${this.getHomeworkS3FolderPath(creator.id)}${fileName}`;

        await this.filesService.uploadFile(
            this.configService.get<string>("aws.appBucketName"),
            objectKey,
            fileContent,
            FileMimeType.Text,
        );

        return objectKey;
    }

    private getHomeworkS3FolderPath(studentId: number) {
        return `${S3BucketPath.Homework}/${studentId}/`;
    }

    private setFileName(courseName: string, studentName: string, lessonId: number): string {
        return `${studentName}. Homework ${courseName} - lesson #${lessonId}.txt`;
    }

    private async validateCreate(dto: CreateHomeworkDto, studentId: number): Promise<Lesson> {
        await this.checkIfExists(dto.lessonId, studentId);
        const lesson = await this.checkIfLessonExists(dto.lessonId);
        await this.checkIfStudentExists(studentId);

        return lesson;
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
    abstract createHomework(
        dto: CreateHomeworkDto,
        file: Buffer,
        fileName: string,
        creator: User,
    ): Promise<HomeworkViewModel>;
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

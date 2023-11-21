import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { User } from "@app/users/entities/user.entity";
import { IHomeworksRepository } from "./homeworks.repository";
import { HomeworkViewModelFactory } from "./model-factories";
import { HomeworkViewModel } from "./view-models";
import { ILessonsRepository } from "@app/lessons/lessons.repository";
import { IUsersRepository } from "@app/users/users.repository";
import { Lesson } from "@app/lessons/entities/lesson.entity";
import { IFilesService } from "@app/files/files.service.interface";
import { BaseErrorMessage, FileMimeType, RoleName, S3BucketPath } from "@common/enum";
import { ConfigService } from "@nestjs/config";
import { HomeworkModelFactory } from "./model-factories/homework.factory";
import { Homework } from "./entities/homework.entity";
import { DataListResponse } from "@common/db/data-list-response";
import { ColumnType, QueryParamsDTO } from "@common/dto/query-params.dto";
import { ApplyToQueryExtension, DatatablesConfig } from "@common/query-extention";
import { SignedHomeworkURL } from "./interfaces/signed-homework-url.interface";

@Injectable()
export class HomeworksService implements IHomeworksService {
    constructor(
        private readonly configService: ConfigService,
        private readonly filesService: IFilesService,
        private readonly homeworkViewModelFactory: HomeworkViewModelFactory,
        private readonly homeworksRepository: IHomeworksRepository,
        private readonly lessonsRepository: ILessonsRepository,
        private readonly usersRepository: IUsersRepository,
    ) {}
    //#region Public Methods
    public async getAllHomeworks(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<HomeworkViewModel>> {
        const query = this.homeworksRepository.getAllQ();

        const config = this.getDatatablesConfig();

        const [homeworks, count] = await ApplyToQueryExtension.applyToQuery<Homework>(
            queryParams,
            query,
            config,
        );

        const signedHomeWorkURL = await this.signHomeworks(homeworks);

        const model = this.homeworkViewModelFactory.initHomeworkListViewModel(
            homeworks,
            signedHomeWorkURL,
        );

        return new DataListResponse<HomeworkViewModel>(model, count);
    }

    public async getAllStudentHomeworks(
        queryParams: QueryParamsDTO,
        student: User,
    ): Promise<DataListResponse<HomeworkViewModel>> {
        const query = this.homeworksRepository.getAllByStudentQ(student.id);

        const config = this.getDatatablesConfig();

        const [homeworks, count] = await ApplyToQueryExtension.applyToQuery<Homework>(
            queryParams,
            query,
            config,
        );

        const signedHomeWorkURL = await this.signHomeworks(homeworks);

        const model = this.homeworkViewModelFactory.initHomeworkListViewModel(
            homeworks,
            signedHomeWorkURL,
        );

        return new DataListResponse<HomeworkViewModel>(model, count);
    }

    public async getHomework(id: number): Promise<HomeworkViewModel> {
        const homework = await this.homeworksRepository.getById(id);

        if (!homework) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        const url = await this.signHomeworkUrl(homework.filePath);

        return this.homeworkViewModelFactory.initHomeworkViewModel(homework, url);
    }

    public async deleteHomework(id: number, user: User): Promise<void> {
        const homework = await this.validateDelete(id, user);

        await this.deleteHomeworkFile(homework.filePath);

        await this.homeworksRepository.deleteById(id);
    }

    public async createHomework(
        dto: CreateHomeworkDto,
        file: Buffer,
        creator: User,
    ): Promise<HomeworkViewModel> {
        const lesson = await this.validateCreate(dto, creator.id);

        const objecKey = await this.uploadHomework(file, creator, lesson.course.name, dto.lessonId);

        const entity = HomeworkModelFactory.create({
            lesson: lesson,
            student: creator,
            filePath: objecKey,
            createdBy: creator,
            createdAt: new Date(),
        });

        const homework = await this.homeworksRepository.create(entity);
        const url = await this.signHomeworkUrl(homework.filePath);

        return this.homeworkViewModelFactory.initHomeworkViewModel(homework, url);
    }

    public async updateHomework(
        id: number,
        file: Buffer,
        creator: User,
    ): Promise<HomeworkViewModel> {
        const homework = await this.validateUpdate(id, creator);

        const objecKey = await this.uploadHomework(
            file,
            homework.student,
            homework.lesson.course.name,
            homework.lesson.id,
        );

        const entity = HomeworkModelFactory.update({
            id: id,
            student: creator,
            filePath: objecKey,
            modifiedBy: creator,
            modifiedAt: new Date(),
        });

        const newHomework = await this.homeworksRepository.update(entity);
        const url = await this.signHomeworkUrl(homework.filePath);

        return this.homeworkViewModelFactory.initHomeworkViewModel(newHomework, url);
    }
    //#endregion

    //#region Private Methods
    private getDatatablesConfig(): DatatablesConfig {
        return {
            columns: [
                {
                    name: "id",
                    prop: "id",
                    tableName: "homework",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentId",
                    prop: "id",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Integer,
                },
                {
                    name: "studentName",
                    prop: "first_name",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "studentLastName",
                    prop: "last_name",
                    tableName: "student",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "createdAt",
                    prop: "createdAt",
                    tableName: "homework",
                    isSearchable: false,
                    isSortable: true,
                    type: ColumnType.Date,
                },
                {
                    name: "createdBy",
                    prop: "email",
                    tableName: "createdBy",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
                {
                    name: "modifiedAt",
                    prop: "modifiedAt",
                    tableName: "homework",
                    isSearchable: false,
                    isSortable: true,
                    type: ColumnType.Date,
                },
                {
                    name: "modifiedBy",
                    prop: "email",
                    tableName: "modifiedBy",
                    isSearchable: true,
                    isSortable: true,
                    type: ColumnType.Text,
                },
            ],
        };
    }

    private async uploadHomework(
        fileContent: Buffer,
        creator: User,
        courseName: string,
        lessonId: number,
    ): Promise<string> {
        const studentName = `${creator.firstName} ${creator.lastName}`;
        const fileName = this.setFileName(courseName, studentName, lessonId);
        const objectKey = `${this.getHomeworkS3FolderPath(creator.id)}${fileName}`;

        await this.filesService.uploadFile(
            this.getS3Bucket(),
            objectKey,
            fileContent,
            FileMimeType.PDF,
        );

        return objectKey;
    }

    private async deleteHomeworkFile(objectKey: string): Promise<void> {
        await this.filesService.deleteObject(this.getS3Bucket(), objectKey);
    }

    private getS3Bucket(): string {
        return this.configService.getOrThrow<string>("aws.appBucketName");
    }

    private async signHomeworkUrl(objectKey: string): Promise<string> {
        const url = await this.filesService.getSignedReadUrl(
            this.configService.getOrThrow<string>("aws.appBucketName"),
            objectKey,
            this.configService.getOrThrow<number>("aws.s3UrlEpiresInMin") * 60,
        );

        return url;
    }

    private async signHomeworks(homeworkList: Homework[]): Promise<SignedHomeworkURL[]> {
        const signedHomeworks = homeworkList.map(async ({ id, filePath }) => ({
            homeworkId: id,
            url: await this.signHomeworkUrl(filePath),
        }));

        return Promise.all(signedHomeworks);
    }

    private getHomeworkS3FolderPath(studentId: number) {
        return `${S3BucketPath.Homework}/${studentId}/`;
    }

    private setFileName(courseName: string, studentName: string, lessonId: number): string {
        return `${studentName}. Homework ${courseName} - lesson #${lessonId}.pdf`;
    }

    private async validateCreate(dto: CreateHomeworkDto, studentId: number): Promise<Lesson> {
        await this.checkIfExists(dto.lessonId, studentId);
        const lesson = await this.checkIfLessonExists(dto.lessonId);
        const student = await this.checkIfStudentExists(studentId);
        await this.checkIfStudentAssignedToLessonsCourse(student, lesson);

        return lesson;
    }

    private async validateUpdate(id: number, user: User): Promise<Homework> {
        const homework = await this.checkIfNotExists(id);

        if (user.role.name === RoleName.Admin) {
            return homework;
        }

        await this.checkIfStudentExists(user.id);
        await this.checkOwner(homework, user);

        return homework;
    }

    private async validateDelete(id: number, user: User): Promise<Homework> {
        const homework = await this.checkIfNotExists(id);
        await this.checkOwner(homework, user);

        return homework;
    }

    private async checkIfExists(lessonId: number, studentId: number): Promise<void> {
        const homework = await this.homeworksRepository.getByLesson(lessonId, studentId);

        if (homework) {
            throw new ConflictException(`Homework already exists`);
        }
    }

    private async checkIfNotExists(id: number): Promise<Homework> {
        const homework = await this.homeworksRepository.getById(id);

        if (!homework) {
            throw new NotFoundException(BaseErrorMessage.NOT_FOUND);
        }

        return homework;
    }

    private async checkOwner(homework: Homework, user: User): Promise<void> {
        if (homework.createdBy.id == user.id || user.role.name === RoleName.Admin) {
            return;
        }

        throw new BadRequestException("You are not the owner of this homework");
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

    private async checkIfStudentAssignedToLessonsCourse(
        student: User,
        lesson: Lesson,
    ): Promise<void> {
        if (
            lesson.course.id &&
            !student.studentCourses.find((sCourses) => sCourses.courseId === lesson.course.id)
        ) {
            throw new BadRequestException("Provided student is not assigned to the lessons course");
        }
    }
    //#endregion
}

export abstract class IHomeworksService {
    abstract createHomework(
        dto: CreateHomeworkDto,
        file: Buffer,
        creator: User,
    ): Promise<HomeworkViewModel>;
    abstract updateHomework(id: number, file: Buffer, creator: User): Promise<HomeworkViewModel>;
    abstract deleteHomework(id: number, user: User): Promise<void>;
    abstract getAllHomeworks(
        queryParams: QueryParamsDTO,
    ): Promise<DataListResponse<HomeworkViewModel>>;
    abstract getAllStudentHomeworks(
        queryParams: QueryParamsDTO,
        student: User,
    ): Promise<DataListResponse<HomeworkViewModel>>;
    abstract getHomework(id: number): Promise<HomeworkViewModel>;
}

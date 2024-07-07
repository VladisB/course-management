import { Homework } from "../entities/homework.entity";
import { Lesson } from "../../lessons/entities/lesson.entity";
import { User } from "../../users/entities/user.entity";

export abstract class HomeworkModelFactory {
    public static create({
        lesson,
        student,
        filePath,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        lesson: Lesson;
        student: User;
        filePath: string;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Homework {
        const homework = new Homework();

        homework.lesson = lesson;
        homework.student = student;
        homework.filePath = filePath;
        homework.createdBy = createdBy;
        homework.createdAt = createdAt;
        homework.modifiedBy = modifiedBy ?? createdBy;
        homework.modifiedAt = modifiedAt ?? createdAt;

        return homework;
    }

    public static update({
        id,
        lesson,
        student,
        filePath,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        lesson?: Lesson;
        student?: User;
        filePath: string;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Homework {
        const homework = new Homework();

        homework.id = id;
        homework.lesson = lesson;
        homework.student = student;
        homework.filePath = filePath;
        homework.modifiedBy = modifiedBy;
        homework.modifiedAt = modifiedAt;

        return homework;
    }
}

import { User } from "@app/users/entities/user.entity";
import { LessonGrades } from "../entities/lesson-grade.entity";
import { Lesson } from "@app/lessons/entities/lesson.entity";

export abstract class LessonGradesModelFactory {
    public static create({
        lesson,
        student,
        grade,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        lesson: Lesson;
        student: User;
        grade: number;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): LessonGrades {
        const entity = new LessonGrades();

        entity.lesson = lesson;
        entity.student = student;
        entity.grade = grade;

        entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        lesson,
        student,
        grade,
        modifiedAt,
        modifiedBy,
    }: {
        id: number;
        lesson?: Lesson;
        student?: User;
        grade?: number;
        modifiedBy: User;
        modifiedAt: Date;
    }): LessonGrades {
        const entity = new LessonGrades();

        entity.id = id;

        if (lesson) {
            entity.lesson = lesson;
        }

        if (student) {
            entity.student = student;
        }

        if (grade) {
            entity.grade = grade;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

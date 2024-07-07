import { User } from "@app/users/entities/user.entity";
import { Lesson } from "../entities/lesson.entity";
import { Course } from "@app/courses/entities/course.entity";

export abstract class LessonModelFactory {
    public static create({
        theme,
        date,
        course,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        theme: string;
        date: Date;
        course: Course;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Lesson {
        const entity = new Lesson();

        entity.theme = theme;
        entity.date = date;
        entity.course = course;
        entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        theme,
        date,
        course,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        theme: string;
        date: Date;
        course?: Course;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Lesson {
        const entity = new Lesson();

        entity.id = id;
        entity.date = date;
        entity.theme = theme;
        entity.course = course;
        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

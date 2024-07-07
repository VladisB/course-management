import { User } from "@app/users/entities/user.entity";
import { StudentCourses } from "../entities/student-courses.entity";
import { Course } from "@app/courses/entities/course.entity";

export abstract class StudentCoursesModelFactory {
    public static create({
        course,
        student,
        createdAt,
        modifiedAt = createdAt,
    }: {
        course: Course;
        student: User;
        createdAt: Date;
        modifiedAt?: Date;
    }): StudentCourses {
        const entity = new StudentCourses();

        entity.finalMark = 0;
        entity.feedback = "";
        entity.passed = false;
        entity.course = course;
        entity.student = student;
        entity.createdAt = createdAt;
        entity.modifiedAt = modifiedAt;

        return entity;
    }

    public static update({
        id,
        course,
        student,
        finalaMark,
        feedback,
        passed,
        modifiedAt,
    }: {
        id: number;
        course?: Course;
        student?: User;
        finalaMark?: number;
        feedback?: string;
        passed?: boolean;
        modifiedAt: Date;
    }): StudentCourses {
        const entity = new StudentCourses();

        entity.id = id;

        if (course) {
            entity.course = course;
        }

        if (student) {
            entity.student = student;
        }

        if (finalaMark) {
            entity.finalMark = finalaMark;
        }

        if (feedback) {
            entity.feedback = feedback;
        }

        if (passed !== undefined) {
            entity.passed = passed;
        }

        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

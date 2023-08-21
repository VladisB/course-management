import { User } from "@app/users/entities/user.entity";
import { Course } from "@app/courses/entities/course.entity";
import { StudentCourses } from "../entities/student-courses.entity";

export abstract class StudentCourseModelFactory {
    public static create({
        course,
        student,
        finalMark = null,
        feedback = null,
        passed = false,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        course: Course;
        student: User;
        finalMark?: number;
        feedback?: string;
        passed?: boolean;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): StudentCourses {
        const entity = new StudentCourses();

        entity.course = course;
        entity.student = student;
        entity.finalMark = finalMark;
        entity.feedback = feedback;
        entity.passed = passed;

        entity.createdBy = createdBy;
        entity.createdAt = createdAt;

        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        course,
        student,
        finalMark,
        feedback,
        passed,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        course?: Course;
        student?: User;
        finalMark?: number;
        feedback?: string;
        passed?: boolean;
        modifiedBy: User;
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

        if (finalMark) {
            entity.finalMark = finalMark;
        }

        if (feedback) {
            entity.feedback = feedback;
        }

        if (passed) {
            entity.passed = passed;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

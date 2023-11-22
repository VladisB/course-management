import { User } from "@app/users/entities/user.entity";
import { Course } from "@app/courses/entities/course.entity";
import { CourseInstructors } from "../entities/course-instructors.entity";

export abstract class CourseInstructorModelFactory {
    public static create({
        course,
        instructor,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        course: Course;
        instructor: User;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): CourseInstructors {
        const entity = new CourseInstructors();

        entity.course = course;
        entity.instructor = instructor;

        entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        course,
        instructor,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        course?: Course;
        instructor?: User;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): CourseInstructors {
        const entity = new CourseInstructors();

        entity.id = id;

        if (course) {
            entity.course = course;
        }

        if (instructor) {
            entity.instructor = instructor;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

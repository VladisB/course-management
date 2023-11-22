import { User } from "@app/users/entities/user.entity";
import { Group } from "../entities/group.entity";
import { GroupCourses } from "../entities/group-courses.entity";
import { Course } from "@app/courses/entities/course.entity";

export abstract class GroupCoursesModelFactory {
    public static create({
        group,
        course,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        group: Group;
        course: Course;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): GroupCourses {
        const entity = new GroupCourses();

        entity.group = group;
        entity.course = course;

        // entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        // entity.modifiedBy = modifiedBy ?? createdBy;
        // entity.modifiedAt = modifiedAt ?? createdAt;
        entity.updatedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        group,
        course,
        modifiedAt,
        modifiedBy,
    }: {
        id: number;
        group?: Group;
        course?: Course;
        modifiedBy: User;
        modifiedAt: Date;
    }): GroupCourses {
        const entity = new GroupCourses();

        entity.id = id;

        if (group) {
            entity.group = group;
        }

        if (course) {
            entity.course = course;
        }

        // entity.modifiedBy = modifiedBy;
        // entity.modifiedAt = modifiedAt;
        entity.updatedAt = modifiedAt;

        return entity;
    }
}

import { User } from "@app/users/entities/user.entity";
import { Course } from "@app/courses/entities/course.entity";

export abstract class CourseModelFactory {
    public static create({
        name,
        available = false,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        name: string;
        available?: boolean;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Course {
        const entity = new Course();

        entity.name = name;
        entity.available = available;

        // entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        // entity.modifiedBy = modifiedBy ?? createdBy;
        // entity.modifiedAt = modifiedAt ?? createdAt;
        entity.updatedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        name,
        available,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        name?: string;
        available?: boolean;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Course {
        const entity = new Course();

        entity.id = id;

        if (name) {
            entity.name = name;
        }

        if (available) {
            entity.available = available;
        }

        // entity.modifiedBy = modifiedBy;
        // entity.modifiedAt = modifiedAt;
        entity.updatedAt = modifiedAt;

        return entity;
    }
}

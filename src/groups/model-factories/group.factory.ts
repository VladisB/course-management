import { User } from "@app/users/entities/user.entity";
import { Group } from "../entities/group.entity";
import { Faculty } from "@app/faculties/entities/faculty.entity";

export abstract class GroupModelFactory {
    public static create({
        name,
        faculty,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        name: string;
        faculty: Faculty;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Group {
        const entity = new Group();

        entity.name = name;
        entity.faculty = faculty;

        entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        name,
        faculty,
        modifiedAt,
        modifiedBy,
    }: {
        id: number;
        name?: string;
        faculty?: Faculty;
        modifiedBy: User;
        modifiedAt: Date;
    }): Group {
        const entity = new Group();

        entity.id = id;

        if (name) {
            entity.name = name;
        }

        if (faculty) {
            entity.faculty = faculty;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

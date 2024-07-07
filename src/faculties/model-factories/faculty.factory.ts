import { User } from "@app/users/entities/user.entity";
import { Faculty } from "../entities/faculty.entity";

export abstract class FacultyModelFactory {
    public static create({
        name,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        name: string;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Faculty {
        const entity = new Faculty();

        entity.name = name;

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
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        name?: string;
        modifiedBy: User;
        modifiedAt: Date;
    }): Faculty {
        const entity = new Faculty();

        entity.id = id;

        if (name) {
            entity.name = name;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

import { User } from "../../users/entities/user.entity";
import { Role } from "../entities/role.entity";

export abstract class RoleModelFactory {
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
    }): Role {
        const role = new Role();

        role.name = name;
        role.createdBy = createdBy;
        role.createdAt = createdAt;
        role.modifiedBy = modifiedBy ?? createdBy;
        role.modifiedAt = modifiedAt ?? createdAt;

        return role;
    }

    public static update({
        id,
        name,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        name: string;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): Role {
        const role = new Role();

        role.id = id;
        role.name = name;
        role.modifiedBy = modifiedBy;
        role.modifiedAt = modifiedAt;

        return role;
    }
}

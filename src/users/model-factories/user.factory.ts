import { User } from "@app/users/entities/user.entity";
import { Group } from "@app/groups/entities/group.entity";
import { Role } from "@app/roles/entities/role.entity";

export abstract class UserModelFactory {
    public static create({
        email,
        password,
        firstName,
        lastName,
        role,
        group,
        createdBy,
        createdAt,
        modifiedBy = createdBy,
        modifiedAt = createdAt,
    }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: Role;
        group?: Group;
        createdBy: User;
        createdAt: Date;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): User {
        const entity = new User();

        entity.email = email;
        entity.password = password;
        entity.firstName = firstName;
        entity.lastName = lastName;
        entity.role = role;

        if (group) {
            entity.group = group;
        }

        entity.createdBy = createdBy;
        entity.createdAt = createdAt;
        entity.modifiedBy = modifiedBy ?? createdBy;
        entity.modifiedAt = modifiedAt ?? createdAt;

        return entity;
    }

    public static update({
        id,
        email,
        password,
        firstName,
        lastName,
        role,
        group,
        modifiedBy,
        modifiedAt,
    }: {
        id: number;
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        role?: Role;
        group?: Group;
        modifiedBy?: User;
        modifiedAt?: Date;
    }): User {
        const entity = new User();

        entity.id = id;

        if (email) {
            entity.email = email;
        }

        if (password) {
            entity.password = password;
        }

        if (firstName) {
            entity.firstName = firstName;
        }

        if (lastName) {
            entity.lastName = lastName;
        }

        if (role) {
            entity.role = role;
        }

        if (group) {
            entity.group = group;
        }

        entity.modifiedBy = modifiedBy;
        entity.modifiedAt = modifiedAt;

        return entity;
    }
}

import { RoleName, PredefinedUser } from "@app/common/enum";
import { Role } from "@app/roles/entities/role.entity";
import { User } from "@app/users/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

const testPassword = "testsdfsfdDSDD12@";

// PURPOSE: Seed the database with initial data: roles and predefined users
export class InitialSeed1688564094810 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = queryRunner.manager.create(User, [
            {
                email: PredefinedUser.Admin,
                password: testPassword,
                firstName: "Amanda",
                lastName: "Rodriguez",
                role: null,
            },
            {
                email: PredefinedUser.Instructor,
                password: testPassword,
                firstName: "Joshua",
                lastName: "Parker",
                role: null,
            },
            {
                email: PredefinedUser.Student,
                password: testPassword,
                firstName: "Rachel",
                lastName: "Chen",
                role: null,
            },
        ]);

        await queryRunner.manager.save(users);

        const admin = await queryRunner.manager.findOne(User, {
            where: {
                email: PredefinedUser.Admin,
            },
        });

        await queryRunner.manager.insert(Role, [
            { name: RoleName.Admin, createdBy: admin, modifiedBy: admin },
            { name: RoleName.Student, createdBy: admin, modifiedBy: admin },
            { name: RoleName.Instructor, createdBy: admin, modifiedBy: admin },
        ]);

        const adminRole = await queryRunner.manager.findOne(Role, {
            where: {
                name: RoleName.Admin,
            },
        });

        const instructorRole = await queryRunner.manager.findOne(Role, {
            where: {
                name: RoleName.Instructor,
            },
        });

        const studentRole = await queryRunner.manager.findOne(Role, {
            where: {
                name: RoleName.Student,
            },
        });

        const adminUser = users.find((user) => user.email === PredefinedUser.Admin);
        adminUser.role = adminRole;
        await queryRunner.manager.save(adminUser);

        const instructorUser = users.find((user) => user.email === PredefinedUser.Instructor);
        instructorUser.role = instructorRole;
        await queryRunner.manager.save(instructorUser);

        const studentUser = users.find((user) => user.email === PredefinedUser.Student);
        studentUser.role = studentRole;
        await queryRunner.manager.save(studentUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let users = await queryRunner.manager.find(User);
        users = users.map((user) => {
            user.role = null;
            return user;
        });

        await queryRunner.manager.save(users);

        const roles = await queryRunner.manager.find(Role);

        await queryRunner.manager.remove(roles);
        await queryRunner.manager.remove(users);
    }
}

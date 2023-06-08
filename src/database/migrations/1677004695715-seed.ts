import { RoleName } from "src/common/enum";
import { Role } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1677004695715 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(Role, [
            { name: RoleName.Admin },
            { name: RoleName.Student },
            { name: RoleName.Instructor },
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

        const users = queryRunner.manager.create(User, [
            {
                email: "admin@gmail.com",
                password: "testsdfsfdDSDD12@",
                firstName: "Amanda",
                lastName: "Rodriguez",
                role: adminRole,
            },
            {
                email: "instructor@gmail.com",
                password: "testsdfsfdDSDD12@",
                firstName: "Joshua",
                lastName: "Parker",
                role: instructorRole,
            },
            {
                email: "student@gmail.com",
                password: "testsdfsfdDSDD12@",
                firstName: "Rachel",
                lastName: "Chen",
                role: studentRole,
            },
        ]);

        await queryRunner.manager.save(users);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const studentRole = await queryRunner.manager.findOne(Role, {
            where: { name: RoleName.Student },
        });
        const instructorRole = await queryRunner.manager.findOne(Role, {
            where: { name: RoleName.Instructor },
        });
        const adminRole = await queryRunner.manager.findOne(Role, {
            where: { name: RoleName.Admin },
        });

        const users = await queryRunner.manager.find(User);

        await queryRunner.manager.remove(users);
        await queryRunner.manager.remove(studentRole);
        await queryRunner.manager.remove(instructorRole);
        await queryRunner.manager.remove(adminRole);
    }
}

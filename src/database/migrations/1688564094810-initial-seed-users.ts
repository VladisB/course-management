import { RoleName, PredefinedUser } from "@app/common/enum";
import { Role } from "@app/roles/entities/role.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs";

// TODO: move to env
const testPassword = "testsdfsfdDSDD12@";

// PURPOSE: Seed the database with initial data: roles and predefined users
export class InitialSeed1688564094810 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const { salt: sAdmin, password: pAdmin } = await hashPassword(testPassword);
        const { salt: sInstructor, password: pInstructor } = await hashPassword(testPassword);
        const { salt: sStudent, password: pStudent } = await hashPassword(testPassword);

        await queryRunner.manager
            .query(
                `INSERT INTO "user" ("email", "password", "first_name", "last_name", "salt", "role_id") VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12), ($13, $14, $15, $16, $17, $18)`,
                [
                    PredefinedUser.Admin,
                    pAdmin,
                    "Amanda",
                    "Rodriguez",
                    sAdmin,
                    null,
                    PredefinedUser.Instructor,
                    pInstructor,
                    "Joshua",
                    "Parker",
                    sInstructor,
                    null,
                    PredefinedUser.Student,
                    pStudent,
                    "Rachel",
                    "Chen",
                    sStudent,
                    null,
                ],
            )
            .then(() => {
                console.log("Users created");
            });

        const users = await queryRunner.manager.query(`SELECT * FROM "user"`);

        const admin = await queryRunner.manager
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        await queryRunner.manager.query(
            `INSERT INTO "role" ("name", "created_by", "modified_by") VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)`,
            [
                RoleName.Admin,
                admin.id,
                admin.id,
                RoleName.Student,
                admin.id,
                admin.id,
                RoleName.Instructor,
                admin.id,
                admin.id,
            ],
        );

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
        await queryRunner.manager.query(`UPDATE "user" SET "role_id" = $1 WHERE "id" = $2`, [
            adminRole.id,
            adminUser.id,
        ]);

        const instructorUser = users.find((user) => user.email === PredefinedUser.Instructor);
        await queryRunner.manager.query(`UPDATE "user" SET "role_id" = $1 WHERE "id" = $2`, [
            instructorRole.id,
            instructorUser.id,
        ]);

        const studentUser = users.find((user) => user.email === PredefinedUser.Student);
        await queryRunner.manager.query(`UPDATE "user" SET "role_id" = $1 WHERE "id" = $2`, [
            studentRole.id,
            studentUser.id,
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.query(`UPDATE "user" SET "role_id" = $1`, [null]);
        await queryRunner.manager.query(`DELETE FROM "role"`);
        await queryRunner.manager.query(`DELETE FROM "user"`);
    }
}

async function hashPassword(rawPassword: string): Promise<{ salt: string; password: string }> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(rawPassword, salt);

    return { salt, password };
}

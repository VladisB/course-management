import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentCoursesTableUpdate1692651099106 implements MigrationInterface {
    name = "StudentCoursesTableUpdate1692651099106";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "student_courses" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "student_courses" ADD "modified_by" integer`);
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        await queryRunner.query(
            `UPDATE "student_courses" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "student_courses" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca"`,
        );
        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

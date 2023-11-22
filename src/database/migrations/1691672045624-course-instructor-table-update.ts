import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CourseInstructorTableUpdate1691672045624 implements MigrationInterface {
    name = "CourseInstructorTableUpdate1691672045624";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(`ALTER TABLE "course_instructors" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "course_instructors" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "course_instructors" ADD "modified_by" integer`);
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        await queryRunner.query(
            `UPDATE "course_instructors" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "course_instructors" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55"`,
        );
        await queryRunner.query(`ALTER TABLE "course_instructors" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "course_instructors" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "course_instructors" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

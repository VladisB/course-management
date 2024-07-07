import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class LessonTableUpdate1691677998052 implements MigrationInterface {
    name = "LessonTableUpdate1691677998052";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "modified_by" integer`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_474db3096684d11a97580be4d98" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        await queryRunner.query(
            `UPDATE "lesson" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "lesson" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_474db3096684d11a97580be4d98"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca"`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

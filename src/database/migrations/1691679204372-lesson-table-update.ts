import { MigrationInterface, QueryRunner } from "typeorm";

export class LessonTableUpdate1691679204372 implements MigrationInterface {
    name = "LessonTableUpdate1691679204372";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_474db3096684d11a97580be4d98"`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "course_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "created_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "modified_by" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_474db3096684d11a97580be4d98" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_474db3096684d11a97580be4d98"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "modified_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "course_id" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_474db3096684d11a97580be4d98" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

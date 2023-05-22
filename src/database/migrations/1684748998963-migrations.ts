import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1684748998963 implements MigrationInterface {
    name = "migrations1684748998963";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "lesson_grades" ("id" SERIAL NOT NULL, "grade" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "lesson_id" integer, "student_id" integer, "created_by" integer, CONSTRAINT "PK_7924c149bc9d64882c08be8b91c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_09f0be8be11590eeb7268e172d4" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_804bdba71b446724c60d8c68ef5" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_afb5ed9b415ed833cb8a2d08a02" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_afb5ed9b415ed833cb8a2d08a02"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_804bdba71b446724c60d8c68ef5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_09f0be8be11590eeb7268e172d4"`,
        );
        await queryRunner.query(`DROP TABLE "lesson_grades"`);
    }
}

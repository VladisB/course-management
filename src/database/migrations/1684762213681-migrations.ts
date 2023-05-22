import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1684762213681 implements MigrationInterface {
    name = "migrations1684762213681";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_09f0be8be11590eeb7268e172d4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_804bdba71b446724c60d8c68ef5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_afb5ed9b415ed833cb8a2d08a02"`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_86f37f368178ffc70b2b015f57" ON "lesson_grades" ("student_id", "lesson_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_e1fac950f2b668a7b648d04b132" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_b21d97186bb86f4783bdf4b9c33" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_cdc258406d7788091c305eb6f4d" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_cdc258406d7788091c305eb6f4d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_b21d97186bb86f4783bdf4b9c33"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_e1fac950f2b668a7b648d04b132"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_86f37f368178ffc70b2b015f57"`);
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_afb5ed9b415ed833cb8a2d08a02" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_804bdba71b446724c60d8c68ef5" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_09f0be8be11590eeb7268e172d4" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

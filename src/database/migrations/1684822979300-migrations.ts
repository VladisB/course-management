import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1684822979300 implements MigrationInterface {
    name = "migrations1684822979300";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "lesson_grades" ("id" SERIAL NOT NULL, "grade" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "lesson_id" integer NOT NULL, "student_id" integer NOT NULL, "created_by" integer NOT NULL, "modified_by" integer NOT NULL, CONSTRAINT "PK_893daa583c7edb653c2eb795038" PRIMARY KEY ("id"))`,
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
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD CONSTRAINT "FK_5cf64c9ddc32a34d3a46852e212" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" DROP CONSTRAINT "FK_5cf64c9ddc32a34d3a46852e212"`,
        );
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
        await queryRunner.query(`DROP TABLE "lesson_grades"`);
    }
}

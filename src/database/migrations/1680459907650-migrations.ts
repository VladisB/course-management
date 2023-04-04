import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1680459907650 implements MigrationInterface {
    name = "migrations1680459907650";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "student_courses" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "studentId" integer NOT NULL, "final_mark" integer, "feedback" character varying, "passed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6c63b56af68884a5a69dde6a32d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_fc7c3bfa26516ecf6abf659dfd" ON "student_courses" ("courseId", "studentId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_801abb5c5b08ec370fe7baa4de4" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_97e78723f12bbc5d38b67e22552" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_97e78723f12bbc5d38b67e22552"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_801abb5c5b08ec370fe7baa4de4"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7c3bfa26516ecf6abf659dfd"`);
        await queryRunner.query(`DROP TABLE "student_courses"`);
    }
}

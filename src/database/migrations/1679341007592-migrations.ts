import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1679341007592 implements MigrationInterface {
    name = "migrations1679341007592";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "course_instructors" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "instructorId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_bc1d7eab424e6bd80d06f7a9282" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_f2f78c2d313f5b0f28125de623" ON "course_instructors" ("courseId", "instructorId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_c5acff0ea4e35de83fa1c625de0" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_20a75894b36eef8c971432e87c4" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_20a75894b36eef8c971432e87c4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_c5acff0ea4e35de83fa1c625de0"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_f2f78c2d313f5b0f28125de623"`);
        await queryRunner.query(`DROP TABLE "course_instructors"`);
    }
}

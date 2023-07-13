import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1688563314966 implements MigrationInterface {
    name = "Migrations1688563314966";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "faculty" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_51150eab3799d36d1ee6f9a6433" UNIQUE ("name"), CONSTRAINT "PK_635ca3484f9c747b6635a494ad9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "created_by" integer NOT NULL, "modified_by" integer NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "student_courses" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "studentId" integer NOT NULL, "final_mark" double precision, "feedback" character varying, "passed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6c63b56af68884a5a69dde6a32d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_fc7c3bfa26516ecf6abf659dfd" ON "student_courses" ("courseId", "studentId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "homework" ("id" SERIAL NOT NULL, "file_path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "lesson_id" integer NOT NULL, "student_id" integer NOT NULL, "created_by" integer NOT NULL, "modified_by" integer NOT NULL, CONSTRAINT "PK_90dbf463ef94040ed137c4fd38d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_9cc25742e09a62f714349ada0e" ON "homework" ("student_id", "lesson_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "theme" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "course_id" integer, CONSTRAINT "UQ_99952781cceb16c3d60cae671fa" UNIQUE ("theme"), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "lesson_grades" ("id" SERIAL NOT NULL, "grade" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "lesson_id" integer NOT NULL, "student_id" integer NOT NULL, "created_by" integer NOT NULL, "modified_by" integer NOT NULL, CONSTRAINT "PK_893daa583c7edb653c2eb795038" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_86f37f368178ffc70b2b015f57" ON "lesson_grades" ("student_id", "lesson_id") `,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "refresh_token" character varying, "salt" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "role_id" integer, "group_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "faculty_id" integer, CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "group_courses" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "groupId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_c62b022599038669a5fa80823d1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_2f2b3796be2954f829fa8e665a" ON "group_courses" ("courseId", "groupId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "course" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "available" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_30d559218724a6d6e0cc4f26b0e" UNIQUE ("name"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "course_instructors" ("id" SERIAL NOT NULL, "courseId" integer NOT NULL, "instructorId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_bc1d7eab424e6bd80d06f7a9282" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_f2f78c2d313f5b0f28125de623" ON "course_instructors" ("courseId", "instructorId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "role" ADD CONSTRAINT "FK_04a09925beea59e864e921db4a1" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "role" ADD CONSTRAINT "FK_ebbba2b6e74f50a6ba0066a4fe5" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_801abb5c5b08ec370fe7baa4de4" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_97e78723f12bbc5d38b67e22552" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" ADD CONSTRAINT "FK_de7bc545853203cd392915c99ec" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" ADD CONSTRAINT "FK_dcef632b4944fb70c3d8481ae0e" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" ADD CONSTRAINT "FK_b2697d15309599bde02b193c8b8" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" ADD CONSTRAINT "FK_955eefd4d71dea989d2bce72175" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_3c29fba6fe013ec8724378ce7c9" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_243f2defdcc37ee9061a81c8818" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_courses" ADD CONSTRAINT "FK_f7c156752db5fc48aea9e9deaef" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_courses" ADD CONSTRAINT "FK_e56115dc4cfb4d40ab55e6a6e6c" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
        await queryRunner.query(
            `ALTER TABLE "group_courses" DROP CONSTRAINT "FK_e56115dc4cfb4d40ab55e6a6e6c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_courses" DROP CONSTRAINT "FK_f7c156752db5fc48aea9e9deaef"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_243f2defdcc37ee9061a81c8818"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_3c29fba6fe013ec8724378ce7c9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`,
        );
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
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" DROP CONSTRAINT "FK_955eefd4d71dea989d2bce72175"`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" DROP CONSTRAINT "FK_b2697d15309599bde02b193c8b8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" DROP CONSTRAINT "FK_dcef632b4944fb70c3d8481ae0e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "homework" DROP CONSTRAINT "FK_de7bc545853203cd392915c99ec"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_97e78723f12bbc5d38b67e22552"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_801abb5c5b08ec370fe7baa4de4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "role" DROP CONSTRAINT "FK_ebbba2b6e74f50a6ba0066a4fe5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "role" DROP CONSTRAINT "FK_04a09925beea59e864e921db4a1"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_f2f78c2d313f5b0f28125de623"`);
        await queryRunner.query(`DROP TABLE "course_instructors"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f2b3796be2954f829fa8e665a"`);
        await queryRunner.query(`DROP TABLE "group_courses"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86f37f368178ffc70b2b015f57"`);
        await queryRunner.query(`DROP TABLE "lesson_grades"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cc25742e09a62f714349ada0e"`);
        await queryRunner.query(`DROP TABLE "homework"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7c3bfa26516ecf6abf659dfd"`);
        await queryRunner.query(`DROP TABLE "student_courses"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "faculty"`);
    }
}

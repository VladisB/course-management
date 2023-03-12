import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1676822227175 implements MigrationInterface {
    name = "initial1676822227175";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "faculty" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_51150eab3799d36d1ee6f9a6433" UNIQUE ("name"), CONSTRAINT "PK_635ca3484f9c747b6635a494ad9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
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
            `CREATE TABLE "course" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_30d559218724a6d6e0cc4f26b0e" UNIQUE ("name"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f2b3796be2954f829fa8e665a"`);
        await queryRunner.query(`DROP TABLE "group_courses"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "faculty"`);
    }
}

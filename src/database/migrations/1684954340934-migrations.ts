import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1684954340934 implements MigrationInterface {
    name = "migrations1684954340934";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "homework" (
                "id" SERIAL NOT NULL,
                "file_path" character varying NOT NULL,
                "lesson_id" integer NOT NULL,
                "student_id" integer NOT NULL,
                "created_by" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "modified_by" integer NOT NULL,
                "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "PK_90dbf463ef94040ed137c4fd38d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_9cc25742e09a62f714349ada0e" ON "homework" ("student_id", "lesson_id") `,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`DROP INDEX "public"."IDX_9cc25742e09a62f714349ada0e"`);
        await queryRunner.query(`DROP TABLE "homework"`);
    }
}

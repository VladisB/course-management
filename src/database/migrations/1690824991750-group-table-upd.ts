import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupTableUpd1690824991750 implements MigrationInterface {
    name = "GroupTableUpd1690824991750";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "group" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "group" ADD "modified_by" integer`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_f340d1a9f23cb573171390227c9" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_0425fab3b1100812aeb67727e70" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(
            `UPDATE "group" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "group" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_0425fab3b1100812aeb67727e70"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_f340d1a9f23cb573171390227c9"`,
        );
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

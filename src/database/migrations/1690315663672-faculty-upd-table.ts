import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class FacultyUpdTable1690315663672 implements MigrationInterface {
    name = "FacultyUpdTable1690315663672";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faculty" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "faculty" ADD "modified_by" integer`);
        await queryRunner.query(`ALTER TABLE "faculty" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "faculty" ADD "modifiedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );

        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(
            `UPDATE "faculty" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "faculty" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );

        await queryRunner.query(
            `ALTER TABLE "faculty" ADD CONSTRAINT "FK_675ac254087e5c2953c7c40581f" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "faculty" ADD CONSTRAINT "FK_b0544b8bb9593f235c004f34431" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "faculty" DROP CONSTRAINT "FK_b0544b8bb9593f235c004f34431"`,
        );
        await queryRunner.query(
            `ALTER TABLE "faculty" DROP CONSTRAINT "FK_675ac254087e5c2953c7c40581f"`,
        );
        await queryRunner.query(`ALTER TABLE "faculty" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "faculty" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "faculty" DROP COLUMN "modifiedAt"`);
        await queryRunner.query(
            `ALTER TABLE "faculty" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

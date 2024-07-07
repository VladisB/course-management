import { PredefinedUser } from "@app/common/enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTableUpdate1691679563509 implements MigrationInterface {
    name = "UserTableUpdate1691679563509";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "user" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "modified_by" integer`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_d2f5e343630bd8b7e1e7534e82e" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_60919e8ebef42a386bfc3940861" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );

        const user = await queryRunner
            .query(`SELECT * FROM "user" WHERE "email" = $1 LIMIT 1`, [PredefinedUser.Admin])
            .then((res) => res[0]);

        if (!user) {
            throw new Error("System user not found");
        }

        await queryRunner.query(
            `UPDATE "user" SET "created_by" = ${user.id} WHERE "created_by" IS NULL`,
        );
        await queryRunner.query(
            `UPDATE "user" SET "modified_by" = ${user.id} WHERE "modified_by" IS NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_60919e8ebef42a386bfc3940861"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_d2f5e343630bd8b7e1e7534e82e"`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

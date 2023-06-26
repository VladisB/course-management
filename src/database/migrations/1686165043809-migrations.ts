import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1686165043809 implements MigrationInterface {
    name = "Migrations1686165043809";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
        await queryRunner.query(
            `ALTER TABLE "role" ADD "modified_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
        await queryRunner.query(`ALTER TABLE "role" ADD "created_by" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ADD "modified_by" integer NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "role" ADD CONSTRAINT "FK_04a09925beea59e864e921db4a1" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "role" ADD CONSTRAINT "FK_ebbba2b6e74f50a6ba0066a4fe5" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "role" DROP CONSTRAINT "FK_ebbba2b6e74f50a6ba0066a4fe5"`,
        );
        await queryRunner.query(
            `ALTER TABLE "role" DROP CONSTRAINT "FK_04a09925beea59e864e921db4a1"`,
        );
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "modified_by"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "modified_at"`);
        await queryRunner.query(
            `ALTER TABLE "role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
        );
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupTableUpd1690832209851 implements MigrationInterface {
    name = "GroupTableUpd1690832209851";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_f340d1a9f23cb573171390227c9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_0425fab3b1100812aeb67727e70"`,
        );
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "created_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "modified_by" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_f340d1a9f23cb573171390227c9" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_0425fab3b1100812aeb67727e70" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_0425fab3b1100812aeb67727e70"`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" DROP CONSTRAINT "FK_f340d1a9f23cb573171390227c9"`,
        );
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "modified_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_0425fab3b1100812aeb67727e70" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group" ADD CONSTRAINT "FK_f340d1a9f23cb573171390227c9" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

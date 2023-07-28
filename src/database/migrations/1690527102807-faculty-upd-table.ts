import { MigrationInterface, QueryRunner } from "typeorm";

export class FacultyUpdTable1690527102807 implements MigrationInterface {
    name = "FacultyUpdTable1690527102807";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "faculty" DROP CONSTRAINT "FK_675ac254087e5c2953c7c40581f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "faculty" DROP CONSTRAINT "FK_b0544b8bb9593f235c004f34431"`,
        );
        await queryRunner.query(`ALTER TABLE "faculty" ALTER COLUMN "created_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faculty" ALTER COLUMN "modified_by" SET NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "faculty" ALTER COLUMN "modified_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faculty" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "faculty" ADD CONSTRAINT "FK_b0544b8bb9593f235c004f34431" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "faculty" ADD CONSTRAINT "FK_675ac254087e5c2953c7c40581f" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

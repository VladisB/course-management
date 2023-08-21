import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentCoursesTableUpdate1692651645249 implements MigrationInterface {
    name = "StudentCoursesTableUpdate1692651645249";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ALTER COLUMN "created_by" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ALTER COLUMN "modified_by" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" DROP CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca"`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ALTER COLUMN "modified_by" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ALTER COLUMN "created_by" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_0c3f1b7b7aa342c5750f15d43e4" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "student_courses" ADD CONSTRAINT "FK_7f2c2141372bb6cd6151819c6ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

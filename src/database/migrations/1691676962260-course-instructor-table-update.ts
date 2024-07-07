import { MigrationInterface, QueryRunner } from "typeorm";

export class CourseInstructorTableUpdate1691676962260 implements MigrationInterface {
    name = "CourseInstructorTableUpdate1691676962260";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ALTER COLUMN "created_by" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ALTER COLUMN "modified_by" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" DROP CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55"`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ALTER COLUMN "modified_by" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ALTER COLUMN "created_by" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_08d8ee6ade9c87f1ce42872b479" FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "course_instructors" ADD CONSTRAINT "FK_ed80ec2d2787a1f5a6e6bb5ea55" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

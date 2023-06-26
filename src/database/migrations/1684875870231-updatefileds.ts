import { MigrationInterface, QueryRunner } from "typeorm";

export class updatefileds1684875870231 implements MigrationInterface {
    name = "updatefileds1684875870231";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "final_mark"`);
        await queryRunner.query(`ALTER TABLE "student_courses" ADD "final_mark" double precision`);
        await queryRunner.query(`ALTER TABLE "lesson_grades" DROP COLUMN "grade"`);
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" ADD "grade" double precision NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_grades" DROP COLUMN "grade"`);
        await queryRunner.query(`ALTER TABLE "lesson_grades" ADD "grade" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_courses" DROP COLUMN "final_mark"`);
        await queryRunner.query(`ALTER TABLE "student_courses" ADD "final_mark" integer`);
    }
}

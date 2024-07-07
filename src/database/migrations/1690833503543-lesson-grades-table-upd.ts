import { MigrationInterface, QueryRunner } from "typeorm";

export class LessonGradesTableUpd1690833503543 implements MigrationInterface {
    name = "LessonGradesTableUpd1690833503543";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" RENAME COLUMN "updated_at" TO "modified_at"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_grades" RENAME COLUMN "modified_at" TO "updated_at"`,
        );
    }
}

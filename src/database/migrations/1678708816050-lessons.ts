import { MigrationInterface, QueryRunner } from "typeorm";

export class lessons1678708816050 implements MigrationInterface {
    name = "lessons1678708816050";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_8ca007b611c70e9e649a1d60a33"`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" RENAME COLUMN "cours_id" TO "course_id"`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
        );
        await queryRunner.query(`ALTER TABLE "lesson" RENAME COLUMN "course_id" TO "cours_id"`);
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD CONSTRAINT "FK_8ca007b611c70e9e649a1d60a33" FOREIGN KEY ("cours_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}

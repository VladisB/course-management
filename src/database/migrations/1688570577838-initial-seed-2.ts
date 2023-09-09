import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed21688570577838 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "faculty" ("name") VALUES ('Department of Computer Science and Engineering')`,
        );
        await queryRunner.query(
            `INSERT INTO "faculty" ("name") VALUES ('Department of Information Technology and Management')`,
        );
        await queryRunner.query(
            `INSERT INTO "faculty" ("name") VALUES ('School of Data Science and Analytics')`,
        );
        await queryRunner.query(
            `INSERT INTO "faculty" ("name") VALUES ('Faculty of Cybersecurity and Network Engineering')`,
        );
        await queryRunner.query(
            `INSERT INTO "faculty" ("name") VALUES ('Institute of Artificial Intelligence and Machine Learning')`,
        );
        await queryRunner.query(
            `INSERT INTO "course" ("name") VALUES ('Introduction to Programming')`,
        );
        await queryRunner.query(
            `INSERT INTO "course" ("name") VALUES ('Data Structures and Algorithms')`,
        );
        await queryRunner.query(
            `INSERT INTO "course" ("name") VALUES ('Database Systems and Management')`,
        );
        await queryRunner.query(
            `INSERT INTO "course" ("name") VALUES ('Web Development and Design')`,
        );

        const courses = await queryRunner.query(`SELECT * FROM "course"`);

        await queryRunner.query(
            `INSERT INTO "lesson" ("theme", "date", "course_id") VALUES ('Basics of programming languages and concepts', '2021-09-01 12:00:00', ${courses[0].id})`,
        );
        await queryRunner.query(
            `INSERT INTO "lesson" ("theme", "date", "course_id") VALUES ('Introduction to popular programming languages', '2021-09-02 12:00:00', ${courses[0].id})`,
        );
        await queryRunner.query(
            `INSERT INTO "lesson" ("theme", "date", "course_id") VALUES ('Database Systems and Management', '2021-09-03 12:00:00', ${courses[0].id})`,
        );
        await queryRunner.query(
            `INSERT INTO "lesson" ("theme", "date", "course_id") VALUES ('Web Development and Design', '2021-09-04 12:00:00', ${courses[0].id})`,
        );

        const faculty = await queryRunner
            .query(`SELECT * FROM "faculty" WHERE "name" = $1 LIMIT 1`, [
                "Department of Computer Science and Engineering",
            ])
            .then((res) => res[0]);
        await queryRunner.query(
            `INSERT INTO "group" ("name", "faculty_id") VALUES ('ITKNy-17-3', ${faculty.id})`,
        );

        const groupToUpdate = await queryRunner
            .query(`SELECT * FROM "group" WHERE "name" = $1 LIMIT 1`, ["ITKNy-17-3"])
            .then((res) => res[0]);

        await queryRunner.query(
            `INSERT INTO "group_courses" ("groupId", "courseId") VALUES (${groupToUpdate.id}, ${courses[0].id})`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "group_courses"`);
        await queryRunner.query(`DELETE FROM "group"`);
        await queryRunner.query(`DELETE FROM "lesson"`);
        await queryRunner.query(`DELETE FROM "course"`);
        await queryRunner.query(`DELETE FROM "faculty"`);
    }
}

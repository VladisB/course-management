import { MigrationInterface, QueryRunner } from "typeorm";

export class RoleTriggers1700599748736 implements MigrationInterface {
    name = "RoleTriggers1700599748736";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the check_instructor_role_func function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.check_instructor_role_func()
            RETURNS trigger
            LANGUAGE plpgsql
            AS $function$
            DECLARE
                role_name VARCHAR;
            BEGIN
                SELECT Role.name
                INTO role_name
                FROM "role", "user"
                WHERE "user".id = NEW."instructorId" AND "user"."role_id" = "role".id;

                IF role_name = 'instructor' THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION 'The referenced user does not have an "instructor" role';
                END IF;
            END;
            $function$
        `);

        // Create the check_instructor_role_trigger trigger
        await queryRunner.query(`
            CREATE TRIGGER check_instructor_role_trigger
            BEFORE INSERT OR UPDATE ON course_instructors
            FOR EACH ROW
            EXECUTE FUNCTION check_instructor_role_func();
        `);

        // Create the check_student_role_func function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.check_student_role_func()
            RETURNS trigger
            LANGUAGE plpgsql
            AS $function$
            DECLARE
                role_name VARCHAR;
            BEGIN
                SELECT Role.name
                INTO role_name
                FROM "role", "user"
                WHERE "user".id = NEW."studentId" AND "user"."role_id" = "role".id;

                IF role_name = 'student' THEN
                    RETURN NEW;
                ELSE
                    RAISE EXCEPTION 'The referenced user does not have an "student" role';
                END IF;
            END;
            $function$
        `);

        // Create the check_student_role_trigger trigger
        await queryRunner.query(`
            CREATE TRIGGER check_student_role_trigger
            BEFORE INSERT OR UPDATE ON student_courses
            FOR EACH ROW
            EXECUTE FUNCTION check_student_role_func();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the check_student_role_trigger trigger
        await queryRunner.query(`
            DROP TRIGGER check_student_role_trigger ON student_courses;
        `);

        // Drop the check_student_role_func function
        await queryRunner.query(`
            DROP FUNCTION public.check_student_role_func;
        `);

        // Drop the check_instructor_role_trigger trigger
        await queryRunner.query(`
            DROP TRIGGER check_instructor_role_trigger ON course_instructors;
        `);

        // Drop the check_instructor_role_func function
        await queryRunner.query(`
            DROP FUNCTION public.check_instructor_role_func;
        `);
    }
}

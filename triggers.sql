-- additional triggers for the database

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
;

CREATE TRIGGER check_instructor_role_trigger
BEFORE INSERT OR UPDATE ON course_instructors
FOR EACH ROW
EXECUTE FUNCTION check_instructor_role_func();

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
;

CREATE TRIGGER check_student_role_trigger
BEFORE INSERT OR UPDATE ON student_courses
FOR EACH ROW
EXECUTE FUNCTION check_student_role_func();

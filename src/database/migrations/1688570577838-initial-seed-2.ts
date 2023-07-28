import { Course } from "@app/courses/entities/course.entity";
import { Faculty } from "@app/faculties/entities/faculty.entity";
import { GroupCourses } from "@app/groups/entities/group-to-course.entity";
import { Group } from "@app/groups/entities/group.entity";
import { Lesson } from "@app/lessons/entities/lesson.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed21688570577838 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(Faculty, [
            { name: "Department of Computer Science and Engineering" },
            { name: "Department of Information Technology and Management" },
            { name: "School of Data Science and Analytics" },
            { name: "Faculty of Cybersecurity and Network Engineering" },
            { name: "Institute of Artificial Intelligence and Machine Learning" },
        ]);

        const courses = queryRunner.manager.create(Course, [
            {
                name: "Introduction to Programming",
            },
            {
                name: "Data Structures and Algorithms",
            },
            {
                name: "Database Systems and Management",
            },
            {
                name: "Web Development and Design",
            },
        ]);

        await queryRunner.manager.save(courses);

        const lessons = queryRunner.manager.create(Lesson, [
            {
                theme: "Basics of programming languages and concepts",
                date: new Date("2021-09-01:12:00:00"),
                course: courses[0],
            },
            {
                theme: "Introduction to popular programming languages",
                date: new Date("2021-09-02:12:00:00"),
                course: courses[0],
            },
            {
                theme: "Database Systems and Management",
                date: new Date("2021-09-03:12:00:00"),
                course: courses[0],
            },
            {
                theme: "Web Development and Design",
                date: new Date("2021-09-04:12:00:00"),
                course: courses[0],
            },
        ]);

        await queryRunner.manager.save(lessons);

        const faculty = await queryRunner.manager.findOne(Faculty, {
            where: {
                name: "Department of Computer Science and Engineering",
            },
        });

        const group = queryRunner.manager.create(Group, [
            {
                name: "ITKNy-17-3",
                faculty,
            },
        ]);

        await queryRunner.manager.save(group);

        const groupToUpdate = await queryRunner.manager.find(Group, {
            where: {
                name: "ITKNy-17-3",
            },
        });

        const groupCourses = queryRunner.manager.create(GroupCourses, [
            {
                group: groupToUpdate[0],
                course: courses[0],
            },
        ]);

        await queryRunner.manager.save(groupCourses);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(GroupCourses, {});
        await queryRunner.manager.delete(Group, {});
        await queryRunner.manager.delete(Lesson, {});
        await queryRunner.manager.delete(Course, {});
        await queryRunner.manager.delete(Faculty, {});
    }
}

import { Course } from "src/courses/entities/course.entity";
import { Faculty } from "src/faculties/entities/faculty.entity";
import { GroupCourses } from "src/groups/entities/group-to-course.entity";
import { Group } from "src/groups/entities/group.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { User } from "src/users/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1677004695716 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(Faculty, [
            { name: "Department of Computer Science and Engineering" },
            { name: "Department of Information Technology and Management" },
            { name: "School of Data Science and Analytics" },
            { name: "Faculty of Cybersecurity and Network Engineering" },
            { name: "Institute of Artificial Intelligence and Machine Learning" },
        ]);

        const instructor = await queryRunner.manager.findOne(User, {
            where: {
                email: "instructor@gmail.com",
                password: "testsdfsfdDSDD12@",
                firstName: "Joshua",
                lastName: "Parker",
            },
        });

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
                date: new Date("2021-09-01:12:00:00"),
                course: courses[0],
            },
            {
                theme: "Database Systems and Management",
                date: new Date("2021-09-01:12:00:00"),
                course: courses[0],
            },
            {
                theme: "Web Development and Design",
                date: new Date("2021-09-01:12:00:00"),
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
        // const studentRole = await queryRunner.manager.findOne(Role, {
        //     where: { name: RoleName.Student },
        // });
        // const instructorRole = await queryRunner.manager.findOne(Role, {
        //     where: { name: RoleName.Instructor },
        // });
        // const adminRole = await queryRunner.manager.findOne(Role, {
        //     where: { name: RoleName.Admin },
        // });
        // const users = await queryRunner.manager.find(User);
        // await queryRunner.manager.remove(users);
        // await queryRunner.manager.remove(studentRole);
        // await queryRunner.manager.remove(instructorRole);
        // await queryRunner.manager.remove(adminRole);
    }
}

import { User } from "src/users/entities/user.entity";
import {
    StudentCourseViewModel,
    StudentDetailsViewModel,
    StudentListViewModel,
} from "../view-models";
import { Course } from "src/courses/entities/course.entity";

export class StudentsViewModelFactory implements IStudentsViewModelFactory {
    public initStudentCourseViewModel(courses: Course[]): StudentCourseViewModel[] {
        const model: StudentCourseViewModel[] = [];

        return this.setStudentCourseViewModel(model, courses);
    }

    public initStudentDetailsViewModel(student: User): StudentDetailsViewModel {
        const model: StudentDetailsViewModel = {
            id: null,
            email: "",
            firstName: "",
            lastName: "",
            group: null,
            courseList: [],
        };

        return this.setStudentDetailsViewModel(model, student);
    }

    public initStudentListViewModel(students: User[]): StudentListViewModel[] {
        const model: StudentListViewModel[] = [];

        return this.setStudentListViewModel(model, students);
    }

    private setStudentCourseViewModel(
        model: StudentCourseViewModel[],
        courses: Course[],
    ): StudentCourseViewModel[] {
        if (courses.length) {
            const courseList: StudentCourseViewModel[] = courses.map((course) => ({
                id: course.id,
                name: course.name,
                passed: course.studentCourses[0].passed,
            }));

            model.push(...courseList);
        }

        return model;
    }

    private setStudentDetailsViewModel(
        model: StudentDetailsViewModel,
        student: User,
    ): StudentDetailsViewModel {
        if (student) {
            model.id = student.id;
            model.email = student.email;
            model.firstName = student.firstName;
            model.lastName = student.lastName;
            model.group = student.group ? student.group.name : null;
            model.courseList = this.pupulateCourseList(student);
        }

        return model;
    }

    private setStudentListViewModel(
        model: StudentListViewModel[],
        students: User[],
    ): StudentListViewModel[] {
        if (students.length) {
            const userList: StudentListViewModel[] = students.map((student) => ({
                id: student.id,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                group: student.group ? student.group.name : null,
            }));

            model.push(...userList);
        }

        return model;
    }

    private pupulateCourseList(student: User): StudentCourseViewModel[] {
        if (student.studentCourses.length) {
            const courseList: StudentCourseViewModel[] = student.studentCourses.map(
                (studentCourses) => ({
                    id: studentCourses.course.id,
                    passed: studentCourses.passed,
                    name: studentCourses.course.name,
                }),
            );

            return courseList;
        }
    }
}

export abstract class IStudentsViewModelFactory {
    abstract initStudentDetailsViewModel(student: User): StudentDetailsViewModel;
    abstract initStudentListViewModel(students: User[]): StudentListViewModel[];
    abstract initStudentCourseViewModel(courses: Course[]): StudentCourseViewModel[];
}

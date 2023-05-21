import { User } from "src/users/entities/user.entity";
import {
    StudentCourseViewModel,
    StudentDetailsViewModel,
    StudentListViewModel,
} from "../view-models";

export class StudentsViewModelFactory implements IStudentsViewModelFactory {
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

        return this.setUserListViewModel(model, students);
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

    private setUserListViewModel(
        model: StudentListViewModel[],
        students: User[],
    ): StudentListViewModel[] {
        if (students.length) {
            const userList: StudentListViewModel[] = students.map((student) => ({
                id: student.id,
                email: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
                role: student.role.name,
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
}

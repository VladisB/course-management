import { User } from "src/users/entities/user.entity";
import { StudentViewModel } from "../view-models";

export class StudentsViewModelFactory implements IStudentsViewModelFactory {
    public initStudentViewModel(student: User): StudentViewModel {
        const model: StudentViewModel = {
            id: null,
            email: "",
            firstName: "",
            lastName: "",
            group: null,
        };

        return this.setUserViewModel(model, student);
    }

    public initStudentListViewModel(students: User[]): StudentViewModel[] {
        const model: StudentViewModel[] = [];

        return this.setUserListViewModel(model, students);
    }

    private setUserViewModel(model: StudentViewModel, student: User): StudentViewModel {
        if (student) {
            model.id = student.id;
            model.email = student.email;
            model.firstName = student.firstName;
            model.lastName = student.lastName;
            model.group = student.group ? student.group.name : null;
        }

        return model;
    }

    private setUserListViewModel(model: StudentViewModel[], students: User[]): StudentViewModel[] {
        if (students.length) {
            const userList: StudentViewModel[] = students.map((student) => ({
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
}

export abstract class IStudentsViewModelFactory {
    abstract initStudentViewModel(student: User): StudentViewModel;
    abstract initStudentListViewModel(students: User[]): StudentViewModel[];
}

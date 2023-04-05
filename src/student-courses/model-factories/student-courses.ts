import { StudentCourses } from "../entities/student-courses.entity";
import { StudentCoursesViewModel } from "../view-models";

export class StudentCoursesViewModelFactory implements IStudentCoursesViewModelFactory {
    public initStudentCoursesViewModel(studentCourses: StudentCourses): StudentCoursesViewModel {
        const model: StudentCoursesViewModel = {
            id: null,
            studentId: null,
            studentName: "",
            studentLastName: "",
            courseId: null,
            courseName: "",
            feedback: "",
            passed: false,
        };

        return this.setStudentCoursesViewModel(model, studentCourses);
    }

    public initStudentCoursesListViewModel(
        studentCourses: StudentCourses[],
    ): StudentCoursesViewModel[] {
        const model: StudentCoursesViewModel[] = [];

        return this.setCourseListViewModel(model, studentCourses);
    }

    private setStudentCoursesViewModel(
        model: StudentCoursesViewModel,
        studentCourses: StudentCourses,
    ): StudentCoursesViewModel {
        if (studentCourses) {
            model.id = studentCourses.id;
            model.studentId = studentCourses.student.id;
            model.studentName = studentCourses.student.firstName;
            model.studentLastName = studentCourses.student.lastName;
            model.courseId = studentCourses.course.id;
            model.courseName = studentCourses.course.name;
            model.feedback = studentCourses.feedback;
            model.passed = studentCourses.passed;
        }

        return model;
    }

    private setCourseListViewModel(
        model: StudentCoursesViewModel[],
        studentCourses: StudentCourses[],
    ): StudentCoursesViewModel[] {
        if (studentCourses.length) {
            const courseList = studentCourses.map<StudentCoursesViewModel>((studentCourse) => ({
                id: studentCourse.id,
                studentId: studentCourse.student.id,
                studentName: studentCourse.student.firstName,
                studentLastName: studentCourse.student.lastName,
                courseId: studentCourse.course.id,
                courseName: studentCourse.course.name,
                feedback: studentCourse.feedback,
                passed: studentCourse.passed,
            }));

            model.push(...courseList);
        }

        return model;
    }
}

interface IStudentCoursesViewModelFactory {
    initStudentCoursesViewModel(studentCourses: StudentCourses): StudentCoursesViewModel;
    initStudentCoursesListViewModel(studentCourses: StudentCourses[]): StudentCoursesViewModel[];
}

import { Lesson } from "@app/lessons/entities/lesson.entity";
import { studentRoleStub } from ".";
import { LessonGrades } from "@app/lesson-grades/entities/lesson-grade.entity";
import { LessonGradeViewModel } from "@app/lesson-grades/view-models";
import { User } from "@app/users/entities/user.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { Course } from "@app/courses/entities/course.entity";

const courseStub = new Course();
courseStub.id = 1;
courseStub.name = "Test course";
courseStub.available = true;

const studentLGStub: User = new User();
studentLGStub.id = 2;
studentLGStub.email = "student@unexisted.com";
studentLGStub.firstName = "John Student";
studentLGStub.lastName = "Doe";
studentLGStub.role = studentRoleStub;
studentLGStub.group = null;

const studentCoursesLGStub = new StudentCourses();
studentCoursesLGStub.id = 1;
studentCoursesLGStub.studentId = studentLGStub.id;
studentCoursesLGStub.courseId = courseStub.id;
studentCoursesLGStub.course = courseStub;

studentLGStub.studentCourses = [studentCoursesLGStub];

const lessonStub = new Lesson();
lessonStub.id = 1;
lessonStub.course = courseStub;
lessonStub.theme = "Test theme";
lessonStub.date = new Date();

const lessonGradeVMStub = new LessonGradeViewModel();
lessonGradeVMStub.id = 1;
lessonGradeVMStub.studentId = 1;
lessonGradeVMStub.studentName = studentLGStub.firstName;
lessonGradeVMStub.studentLastName = studentLGStub.lastName;
lessonGradeVMStub.grade = 5;
lessonGradeVMStub.createdBy = studentLGStub.email;
lessonGradeVMStub.modifiedBy = studentLGStub.email;

const lessonGradeVMMockList: LessonGradeViewModel[] = [lessonGradeVMStub];

const lessonGradesStub = new LessonGrades();
lessonGradesStub.id = 1;
lessonGradesStub.lesson = lessonStub;
lessonGradesStub.student = studentLGStub;
lessonGradesStub.grade = 100;
lessonGradesStub.createdBy = studentLGStub;
lessonGradesStub.modifiedBy = studentLGStub;
lessonGradesStub.createdAt = new Date();
lessonGradesStub.modifiedAt = new Date();

const lessonGradesMockList: LessonGrades[] = [lessonGradesStub];

export {
    lessonGradesStub,
    lessonGradeVMMockList,
    lessonGradesMockList,
    studentLGStub,
    studentCoursesLGStub,
};

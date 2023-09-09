import { StudentCoursesViewModel } from "@app/student-courses/view-models";
import { courseStub, studentRoleStub } from ".";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { User } from "@app/users/entities/user.entity";
import { StudentCourseViewModel } from "@app/students/view-models";

const studentUserStub3: User = new User();
studentUserStub3.id = 2;
studentUserStub3.email = "student@unexisted.com";
studentUserStub3.firstName = "John Student";
studentUserStub3.lastName = "Doe";
studentUserStub3.role = studentRoleStub;
studentUserStub3.group = null;
studentUserStub3.createdAt = new Date();
studentUserStub3.modifiedAt = new Date();

const studentCourseStub = new StudentCourses();
studentCourseStub.id = 1;
studentCourseStub.studentId = studentUserStub3.id;
studentCourseStub.student = studentUserStub3;
studentCourseStub.course = courseStub;
studentCourseStub.courseId = courseStub.id;
studentCourseStub.feedback = "feedback";
studentCourseStub.passed = false;
studentCourseStub.createdAt = new Date();
studentCourseStub.modifiedAt = new Date();

studentUserStub3.studentCourses = [studentCourseStub];

const studentCoursesMockList: StudentCourses[] = [studentCourseStub];

const studentCoursesViewModelStub = new StudentCoursesViewModel();
studentCoursesViewModelStub.id = studentCourseStub.id;
studentCoursesViewModelStub.studentId = studentCourseStub.studentId;
studentCoursesViewModelStub.studentName = studentUserStub3.firstName;
studentCoursesViewModelStub.studentLastName = studentUserStub3.lastName;
studentCoursesViewModelStub.courseId = studentCourseStub.courseId;
studentCoursesViewModelStub.courseName = courseStub.name;
studentCoursesViewModelStub.feedback = studentCourseStub.feedback;
studentCoursesViewModelStub.passed = false;

const studentCoursesViewModelMockList: StudentCoursesViewModel[] = [studentCoursesViewModelStub];

const sudentCourseVMStub = new StudentCourseViewModel();
sudentCourseVMStub.id = courseStub.id;
sudentCourseVMStub.name = courseStub.name;

const studentCourseViewModelList: StudentCourseViewModel[] = [sudentCourseVMStub];

export {
    studentCoursesMockList,
    studentCourseStub,
    studentCoursesViewModelMockList,
    studentUserStub3,
    studentCourseViewModelList,
};

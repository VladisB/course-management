import { StudentCoursesViewModel } from "@app/student-courses/view-models";
import { courseStub, studentRoleStub } from ".";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { User } from "@app/users/entities/user.entity";

const studentUserStub: User = new User();
studentUserStub.id = 2;
studentUserStub.email = "student@unexisted.com";
studentUserStub.firstName = "John Student";
studentUserStub.lastName = "Doe";
studentUserStub.role = studentRoleStub;
studentUserStub.group = null;

const studentCourseStub = new StudentCourses();
studentCourseStub.id = 1;
studentCourseStub.studentId = studentUserStub.id;
studentCourseStub.student = studentUserStub;
studentCourseStub.course = courseStub;
studentCourseStub.courseId = courseStub.id;
studentCourseStub.feedback = "feedback";
studentCourseStub.passed = false;
studentCourseStub.createdAt = new Date();
studentCourseStub.modifiedAt = new Date();

const studentCoursesMockList: StudentCourses[] = [studentCourseStub];

const studentCoursesViewModelStub = new StudentCoursesViewModel();
studentCoursesViewModelStub.id = studentCourseStub.id;
studentCoursesViewModelStub.studentId = studentCourseStub.studentId;
studentCoursesViewModelStub.studentName = studentUserStub.firstName;
studentCoursesViewModelStub.studentLastName = studentUserStub.lastName;
studentCoursesViewModelStub.courseId = studentCourseStub.courseId;
studentCoursesViewModelStub.courseName = courseStub.name;
studentCoursesViewModelStub.feedback = studentCourseStub.feedback;
studentCoursesViewModelStub.passed = false;

const studentCoursesViewModelMockList: StudentCoursesViewModel[] = [studentCoursesViewModelStub];

export { studentCoursesMockList, studentCourseStub, studentCoursesViewModelMockList };

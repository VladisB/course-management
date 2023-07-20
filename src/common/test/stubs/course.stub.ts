import { Course } from "@app/courses/entities/course.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { instructorRoleStub, instructorUserStub, studentUserStub } from ".";
import { CourseInstructors } from "@app/courses/entities/course-to-instructor.entity";
import { User } from "@app/users/entities/user.entity";

const instructorUserStub2: User = new User();
instructorUserStub2.id = 3;
instructorUserStub2.email = "instructor@unexisted.com";
instructorUserStub2.firstName = "John Instructor";
instructorUserStub2.lastName = "Doe";
instructorUserStub2.role = instructorRoleStub;
instructorUserStub2.group = null;

const courseStub = new Course();
courseStub.id = 1;
courseStub.name = "Test course";
courseStub.available = true;

const studentCoursesStub = new StudentCourses();
studentCoursesStub.id = 1;
studentCoursesStub.student = studentUserStub;

courseStub.studentCourses = [studentCoursesStub];

const courseInstructorsStub = new CourseInstructors();
courseInstructorsStub.id = 1;
courseInstructorsStub.instructor = instructorUserStub2;
courseInstructorsStub.course = courseStub;

courseStub.courseInstructors = [courseInstructorsStub];

let courseMockList: Course[] = [];

courseMockList = [courseStub];

export { courseMockList, courseStub };

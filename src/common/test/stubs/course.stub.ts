import { Course } from "@app/courses/entities/course.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { instructorRoleStub, instructorUserStub, studentUserStub } from ".";
import { CourseInstructors } from "@app/courses/entities/course-to-instructor.entity";
import { User } from "@app/users/entities/user.entity";
import { CourseInstructorListItemViewModel, CourseViewModel } from "@app/courses/view-models";

const instructorUserStub2: User = new User();
instructorUserStub2.id = 3;
instructorUserStub2.email = "instructor@unexisted.com";
instructorUserStub2.firstName = "John Instructor";
instructorUserStub2.lastName = "Doe";
instructorUserStub2.role = instructorRoleStub;
instructorUserStub2.group = null;

const courseStub = new Course();
courseStub.id = 1;
courseStub.name = "test course";
courseStub.available = true;

const courseStubCS = new Course();
courseStubCS.id = 2;
courseStubCS.name = "Introduction to Computer Science";
courseStubCS.available = false;

const studentCoursesStub = new StudentCourses();
studentCoursesStub.id = 1;
studentCoursesStub.student = studentUserStub;

courseStub.studentCourses = [studentCoursesStub];
courseStub.groupCourses = [];

const courseInstructorsStub = new CourseInstructors();
courseInstructorsStub.id = 1;
courseInstructorsStub.instructor = instructorUserStub2;
courseInstructorsStub.course = courseStub;

const courseInstructorsCSStub = new CourseInstructors();
courseInstructorsCSStub.id = 2;
courseInstructorsCSStub.instructor = instructorUserStub2;
courseInstructorsCSStub.course = courseStubCS;

courseStub.courseInstructors = [courseInstructorsStub];
courseStubCS.courseInstructors = [courseInstructorsCSStub];

const courseMockList: Course[] = [courseStub, courseStubCS];

const courseInstructorsVMStub = new CourseInstructorListItemViewModel();
courseInstructorsVMStub.instructorId = courseInstructorsStub.instructor.id;
courseInstructorsVMStub.firstName = courseInstructorsStub.instructor.firstName;
courseInstructorsVMStub.lastName = courseInstructorsStub.instructor.lastName;

const courseVMStub = new CourseViewModel();
courseVMStub.id = 1;
courseVMStub.name = "test course";
courseVMStub.instructorList = [courseInstructorsVMStub];

const courseCSVMStub = new CourseViewModel();
courseCSVMStub.id = 2;
courseCSVMStub.name = "Introduction to Computer Science";
courseCSVMStub.instructorList = [];

const courseVMMockList: CourseViewModel[] = [courseVMStub, courseCSVMStub];

export { courseMockList, courseStub, courseVMMockList, courseStubCS };

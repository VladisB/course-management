import { Course } from "@app/courses/entities/course.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { instructorRoleStub, studentUserStub } from ".";
import { User } from "@app/users/entities/user.entity";
import { CourseInstructorListItemViewModel, CourseViewModel } from "@app/courses/view-models";
import { CourseInstructorsListViewModel } from "@app/course-instructors/view-models";
import { CourseInstructors } from "@app/course-instructors/entities/course-instructors.entity";

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
studentCoursesStub.passed = true;
studentCoursesStub.finalMark = 90;

courseStub.studentCourses = [studentCoursesStub];
courseStub.groupCourses = [];

const courseInstructorsStub = new CourseInstructors();
courseInstructorsStub.id = 1;
courseInstructorsStub.instructorId = instructorUserStub2.id;
courseInstructorsStub.instructor = instructorUserStub2;
courseInstructorsStub.course = courseStub;
courseInstructorsStub.courseId = courseStub.id;
courseInstructorsStub.createdAt = new Date();
courseInstructorsStub.modifiedAt = new Date();

const courseInstructorsCSStub = new CourseInstructors();
courseInstructorsCSStub.id = 2;
courseInstructorsCSStub.instructorId = instructorUserStub2.id;
courseInstructorsCSStub.instructor = instructorUserStub2;
courseInstructorsCSStub.course = courseStubCS;
courseInstructorsCSStub.courseId = courseStubCS.id;
courseInstructorsCSStub.createdAt = new Date();
courseInstructorsCSStub.modifiedAt = new Date();

courseStub.courseInstructors = [courseInstructorsStub];
courseStubCS.courseInstructors = [courseInstructorsCSStub];
courseStub.studentCourses = [studentCoursesStub];
courseStubCS.studentCourses = [studentCoursesStub];

const courseMockList: Course[] = [courseStub, courseStubCS];
const courseInstructorsMockList: CourseInstructors[] = [
    courseInstructorsStub,
    courseInstructorsCSStub,
];

const courseInstructorsVMStub = new CourseInstructorListItemViewModel();
courseInstructorsVMStub.instructorId = courseInstructorsStub.instructor.id;
courseInstructorsVMStub.firstName = courseInstructorsStub.instructor.firstName;
courseInstructorsVMStub.lastName = courseInstructorsStub.instructor.lastName;

const courseInstructorsCSVMStub = new CourseInstructorListItemViewModel();
courseInstructorsCSVMStub.instructorId = courseInstructorsCSStub.instructor.id;
courseInstructorsCSVMStub.firstName = courseInstructorsCSStub.instructor.firstName;
courseInstructorsCSVMStub.lastName = courseInstructorsCSStub.instructor.lastName;

const courseInstructorsVMMockList: CourseInstructorListItemViewModel[] = [
    courseInstructorsVMStub,
    courseInstructorsCSVMStub,
];

const courseInstructorsListVMStub = new CourseInstructorsListViewModel();
courseInstructorsListVMStub.courseId = courseInstructorsStub.course.id;
courseInstructorsListVMStub.courseInstructorId = courseInstructorsStub.id;
courseInstructorsListVMStub.courseName = courseInstructorsStub.course.name;
courseInstructorsListVMStub.instructorId = courseInstructorsStub.instructor.id;
courseInstructorsListVMStub.instructorLastName = courseInstructorsStub.instructor.lastName;
courseInstructorsListVMStub.instructorName = courseInstructorsStub.instructor.firstName;

const courseInstructorsListCSVMStub = new CourseInstructorsListViewModel();
courseInstructorsListCSVMStub.courseId = courseInstructorsCSStub.course.id;
courseInstructorsListCSVMStub.courseInstructorId = courseInstructorsCSStub.id;
courseInstructorsListCSVMStub.courseName = courseInstructorsCSStub.course.name;
courseInstructorsListCSVMStub.instructorId = courseInstructorsCSStub.instructor.id;
courseInstructorsListCSVMStub.instructorLastName = courseInstructorsCSStub.instructor.lastName;
courseInstructorsListCSVMStub.instructorName = courseInstructorsCSStub.instructor.firstName;

const courseVMStub = new CourseViewModel();
courseVMStub.id = 1;
courseVMStub.name = "test course";
courseVMStub.instructorList = [courseInstructorsVMStub];

const courseCSVMStub = new CourseViewModel();
courseCSVMStub.id = 2;
courseCSVMStub.name = "Introduction to Computer Science";
courseCSVMStub.instructorList = [];

const courseVMMockList: CourseViewModel[] = [courseVMStub, courseCSVMStub];

const courseInstructorsListVMMockList: CourseInstructorsListViewModel[] = [
    courseInstructorsListVMStub,
    courseInstructorsListCSVMStub,
];

export {
    courseMockList,
    courseStub,
    courseVMMockList,
    courseStubCS,
    courseInstructorsCSStub,
    courseInstructorsStub,
    courseInstructorsMockList,
    courseInstructorsVMMockList,
    courseInstructorsListVMStub,
    courseInstructorsListVMMockList,
};

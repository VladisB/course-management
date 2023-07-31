import { GroupCourses } from "@app/groups/entities/group-courses.entity";
import { groupStub } from ".";
import { Course } from "@app/courses/entities/course.entity";

let groupCoursesMockList: GroupCourses[] = [];

const courseStub = new Course();
courseStub.id = 1;
courseStub.name = "Test course";
courseStub.available = true;

const groupCoursesStub = new GroupCourses();
groupCoursesStub.id = 1;
groupCoursesStub.course = courseStub;
groupCoursesStub.group = groupStub;

groupCoursesMockList = [groupCoursesStub];

export { groupCoursesMockList, groupCoursesStub };

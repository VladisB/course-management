import { GroupCourses } from "@app/groups/entities/group-courses.entity";
import { courseStub, groupStub } from ".";

let groupCoursesMockList: GroupCourses[] = [];

const groupCoursesStub = new GroupCourses();
groupCoursesStub.id = 1;
groupCoursesStub.course = courseStub;
groupCoursesStub.group = groupStub;

groupCoursesMockList = [groupCoursesStub];

export { groupCoursesMockList, groupCoursesStub };

import { Course } from "../entities/course.entity";

const hardwareCourse = new Course();
hardwareCourse.id = 1;
hardwareCourse.name = "Hardware engineering";

const softwareCourse = new Course();
softwareCourse.id = 2;
softwareCourse.name = "Software engineering";

const coursesMock: Course[] = [hardwareCourse, softwareCourse];

export { coursesMock };

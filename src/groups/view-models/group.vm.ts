import { CourseViewModel } from "src/courses/view-models";

export class GroupViewModel {
    id: number;
    groupName: string;
    facultyName: string;
    courses: CourseViewModel[];
}

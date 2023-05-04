export class CourseViewModel {
    id: number;
    name: string;
    instructorList: CourseInstructorListItemViewModel[];
}

export class CourseInstructorListItemViewModel {
    id: number;
    firstName: string;
    lastName: string;
}

export class CourseViewModel {
    id: number;
    name: string;
    instructorList: CourseInstructorListItemViewModel[];
}

export class CourseInstructorListItemViewModel {
    instructorId: number;
    firstName: string;
    lastName: string;
}

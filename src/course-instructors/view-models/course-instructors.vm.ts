export class CourseInstructorsViewModel {
    id: number;
    courseId: number;
    courseName: string;
    instructors: InstructorListItemViewModel[];
}

export class InstructorListItemViewModel {
    instructorId: number;
    instructorName: string;
    instructorLastName: string;
}

export class CourseInstructorsViewModel {
    courseId: number;
    courseName: string;
    instructors: InstructorListItemViewModel[];
}

export class InstructorListItemViewModel {
    courseInstructorId: number;
    instructorId: number;
    instructorName: string;
    instructorLastName: string;
}

export class CourseInstructorViewModel {
    id: number;
    courseId: number;
    courseName: string;
    instructorId: number;
    instructorName: string;
    instructorLastName: string;
}

export class CourseInstructorsListViewModel {
    courseId: number;
    courseInstructorId: number;
    courseName: string;
    instructorId: number;
    instructorLastName: string;
    instructorName: string;
}

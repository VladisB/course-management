export class LessonViewModel {
    id: number;
    courseId: number;
    course: string;
    date: Date;
    theme: string;
    instructorList: LessonInstructorViewModel[];
}

export class LessonInstructorViewModel {
    id: number;
    firstName: string;
    lastName: string;
}

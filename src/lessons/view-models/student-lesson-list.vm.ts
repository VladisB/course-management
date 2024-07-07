import { LessonInstructorViewModel } from "./lesson.vm";

export class StudentLessonListViewModel {
    id: number;
    courseId: number;
    course: string;
    date: Date;
    theme: string;
    grade: number | null;
    instructorList: LessonInstructorViewModel[];
}

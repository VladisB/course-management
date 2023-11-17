export class StudentDetailsViewModel {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    group: string | null;
    courseList: StudentCourseViewModel[];
}

export class StudentCourseViewModel {
    id: number;
    name: string;
    passed: boolean;
}

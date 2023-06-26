export class GroupViewModel {
    id: number;
    groupName: string;
    facultyName: string;
    courses: GroupCoursesViewModel[];
}

export class GroupCoursesViewModel {
    id: number;
    name: string;
}

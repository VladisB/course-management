import { ApiProperty } from "@nestjs/swagger";

class StudentCourseViewModel {
    @ApiProperty({ description: "Course id" })
    id: number;

    @ApiProperty({ description: "Course name" })
    name: string;

    @ApiProperty({ description: "Passed flag" })
    passed: boolean;
}

class StudentDetailsViewModel {
    @ApiProperty({ description: "Student id" })
    id: number;

    @ApiProperty({ description: "Student email" })
    email: string;

    @ApiProperty({ description: "Student first name" })
    firstName: string;

    @ApiProperty({ description: "Student last name" })
    lastName: string;

    @ApiProperty({ description: "Student group" })
    group: string | null;

    @ApiProperty({ description: "Student course list", type: [StudentCourseViewModel] })
    courseList: StudentCourseViewModel[];
}

export { StudentCourseViewModel, StudentDetailsViewModel };

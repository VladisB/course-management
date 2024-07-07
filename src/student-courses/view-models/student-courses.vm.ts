import { ApiProperty } from "@nestjs/swagger";

export class StudentCoursesViewModel {
    @ApiProperty({ description: "Student course id" })
    id: number;

    @ApiProperty({ description: "Student id" })
    studentId: number;

    @ApiProperty({ description: "Student name" })
    studentName: string;

    @ApiProperty({ description: "Student last name" })
    studentLastName: string;

    @ApiProperty({ description: "Course id" })
    courseId: number;

    @ApiProperty({ description: "Course name" })
    courseName: string;

    @ApiProperty({ description: "Feedback" })
    feedback: string;

    @ApiProperty({ description: "Passed flag" })
    passed: boolean;
}

import { ApiProperty } from "@nestjs/swagger";

export class InstructorListItemViewModel {
    @ApiProperty({ description: "Instructor id", example: 1 })
    courseInstructorId: number;

    @ApiProperty({ description: "Instructor id", example: 1 })
    instructorId: number;

    @ApiProperty({ description: "Instructor first name", example: "John" })
    instructorName: string;

    @ApiProperty({ description: "Instructor last name", example: "Doe" })
    instructorLastName: string;
}

//TODO: Move into separate file
export class CourseInstructorViewModel {
    @ApiProperty({ description: "Course Instructor id", example: 1 })
    id: number;

    @ApiProperty({ description: "Course id", example: 1 })
    courseId: number;

    @ApiProperty({ description: "Course name", example: "Computer science" })
    courseName: string;

    @ApiProperty({ description: "Instructor id", example: 1 })
    instructorId: number;

    @ApiProperty({ description: "Instructor first name", example: "John" })
    instructorName: string;

    @ApiProperty({ description: "Instructor last name", example: "Doe" })
    instructorLastName: string;
}

export class CourseInstructorsListViewModel {
    @ApiProperty({ description: "Course id", example: 1 })
    courseId: number;

    @ApiProperty({ description: "Instructor id", example: 1 })
    courseInstructorId: number;

    @ApiProperty({ description: "Course name", example: "Computer science" })
    courseName: string;

    @ApiProperty({ description: "Instructor first id", example: 1 })
    instructorId: number;

    @ApiProperty({ description: "Instructor last name", example: "Doe" })
    instructorLastName: string;

    @ApiProperty({ description: "Instructor first name", example: "John" })
    instructorName: string;
}

export class CourseInstructorsViewModel {
    @ApiProperty({ description: "Course id", example: 1 })
    courseId: number;

    @ApiProperty({ description: "Course name", example: "Computer science" })
    courseName: string;

    @ApiProperty({ description: "Instructors", type: [InstructorListItemViewModel] })
    instructors: InstructorListItemViewModel[];
}

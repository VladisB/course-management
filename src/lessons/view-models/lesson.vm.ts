import { ApiProperty } from "@nestjs/swagger";

export class LessonInstructorViewModel {
    @ApiProperty({ description: "Instructor id" })
    id: number;

    @ApiProperty({ description: "Instructor first name" })
    firstName: string;

    @ApiProperty({ description: "Instructor last name" })
    lastName: string;
}

export class LessonViewModel {
    @ApiProperty({ description: "Lesson id" })
    id: number;

    @ApiProperty({ description: "Course id" })
    courseId: number;

    @ApiProperty({ description: "Course name" })
    course: string;

    @ApiProperty({ description: "Lesson date" })
    date: Date;

    @ApiProperty({ description: "Lesson theme" })
    theme: string;

    @ApiProperty({ description: "Instructor list", type: [LessonInstructorViewModel] })
    instructorList: LessonInstructorViewModel[];
}

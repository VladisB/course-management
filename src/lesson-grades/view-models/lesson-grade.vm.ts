import { ApiProperty } from "@nestjs/swagger";

export class LessonGradeViewModel {
    @ApiProperty({ description: "Lesson grade id", minimum: 1 })
    id: number;

    @ApiProperty({ description: "Lesson id", minimum: 1 })
    studentId: number;

    @ApiProperty({ description: "Lesson name" })
    studentName: string;

    @ApiProperty({ description: "Lesson name" })
    studentLastName: string;

    @ApiProperty({ description: "Lesson grade", minimum: 1 })
    grade: number;

    @ApiProperty({ description: "Creator name" })
    createdBy: string;

    @ApiProperty({ description: "Modifier name" })
    modifiedBy: string;

    @ApiProperty({ description: "Created at" })
    createdAt: Date;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateLessonGradeDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({ description: "Lesson id", minimum: 1 })
    lessonId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({ description: "Student id", minimum: 1 })
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @ApiProperty({ description: "Grade", example: 100, minimum: 1, maximum: 100 })
    grade: number;
}

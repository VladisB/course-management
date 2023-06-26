import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateLessonGradeDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    lessonId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    grade: number;
}

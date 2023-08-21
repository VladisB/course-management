import { IsNotEmpty, IsNumber, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class PATCHUpdateStudentCoursesDto {
    // NOTE: studentId and courseId are not allowed to be changed.

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly finalMark?: number;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(200)
    @IsNotEmpty()
    readonly feedBack?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly passed?: boolean;
}

import { IsNotEmpty, IsNumber, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateStudentCoursesDto {
    // NOTE: studentId and courseId are not allowed to be changed.

    @IsNotEmpty()
    @IsNumber()
    readonly finalMark: number;

    @IsString()
    @MinLength(4)
    @MaxLength(200)
    @IsNotEmpty()
    readonly feedBack: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly passed: boolean;
}

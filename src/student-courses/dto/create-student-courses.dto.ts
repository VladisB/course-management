import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateStudentCoursesDto {
    @IsNotEmpty()
    @IsNumber()
    readonly studentId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly courseId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly finalMark: number;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(200)
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    readonly feedBack: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly passed: boolean;
}

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

export class CreateStudentCoursesDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Student id" })
    readonly studentId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Course id" })
    readonly courseId: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Final Mark", minimum: 1, maximum: 100, required: false })
    readonly finalMark: number;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(200)
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    @ApiProperty({ description: "Feedback", required: false })
    readonly feedBack?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "Passed", required: false })
    readonly passed: boolean;
}

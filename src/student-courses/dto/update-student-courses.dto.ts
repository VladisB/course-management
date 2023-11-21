import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class PATCHUpdateStudentCoursesDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "Final Mark", minimum: 1, maximum: 100, required: false })
    readonly finalMark?: number;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(200)
    @IsNotEmpty()
    @ApiProperty({ description: "Feedback", required: false })
    readonly feedBack?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: "Passed", required: false })
    readonly passed?: boolean;
}

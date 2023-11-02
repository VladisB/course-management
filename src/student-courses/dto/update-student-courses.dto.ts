import { IsNotEmpty, IsNumber, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class PATCHUpdateStudentCoursesDto {
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

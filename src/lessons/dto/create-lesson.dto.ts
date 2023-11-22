import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @Transform(({ value }) => value?.trim())
    @ApiProperty({ description: "Lesson theme" })
    readonly theme: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @Type(() => Date)
    @ApiProperty({ description: "Lesson date" })
    readonly date: Date;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Course id", minimum: 1 })
    readonly courseId: number;
}

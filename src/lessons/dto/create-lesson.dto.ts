import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @Transform(({ value }) => value?.trim())
    readonly theme: string;

    @IsNotEmpty()
    // @IsDateString() // TODO: investigate why this doesn't work and maybe delete
    @Transform(({ value }) => new Date(value))
    @Type(() => Date)
    readonly date: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly courseId: number;
}

import { Transform } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateCourseDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    readonly name: string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber({}, { each: true })
    @IsArray()
    readonly instructorIdList?: number[];
}

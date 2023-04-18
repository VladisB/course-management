import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCourseInstructorsDto {
    @IsNotEmpty()
    @IsOptional()
    @IsNumber({}, { each: true })
    @IsArray()
    readonly instructorIdList: number[];

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    readonly courseId: number;
}

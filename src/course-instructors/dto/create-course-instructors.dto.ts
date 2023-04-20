import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCourseInstructorsDto {
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @IsArray()
    readonly instructorIdList: number[];

    @IsNotEmpty()
    @IsNumber()
    readonly courseId: number;
}

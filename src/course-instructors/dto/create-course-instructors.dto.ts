import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateCourseInstructorsDto {
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @Min(1, { each: true })
    @IsArray()
    @ApiProperty({ type: [Number], description: "Instructor id list" })
    readonly instructorIdList: number[];

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Course id" })
    readonly courseId: number;
}

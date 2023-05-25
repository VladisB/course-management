import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

//TODO: Update this DTO to include the file when FileModule is implemented
export class CreateHomeworkDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    lessonId: number;

    // @IsNotEmpty()
    // @IsNumber()
    // @Min(1)
    // @Max(100)
    // @Type(() => Number)
    file: string;
}

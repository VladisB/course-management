import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    readonly theme: string;

    @IsDate()
    @IsNotEmpty()
    readonly date: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly courseId: number;
}

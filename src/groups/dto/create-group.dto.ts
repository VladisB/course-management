import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly facultyId: number;
}

import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateGroupDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    readonly name?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    readonly facultyId?: number;
}

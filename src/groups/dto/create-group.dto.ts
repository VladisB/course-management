import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    @ApiProperty({ description: "Group name" })
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: "Faculty id" })
    readonly facultyId: number;
}

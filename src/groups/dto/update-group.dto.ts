import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

export class UpdateGroupDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @ApiProperty({ description: "Group name", required: false })
    readonly name?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ description: "Faculty id", required: false })
    readonly facultyId?: number;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber({}, { each: true })
    @Min(1, { each: true })
    @IsArray()
    @ApiProperty({ description: "Course id list", required: false })
    readonly courseIdList?: number[];
}

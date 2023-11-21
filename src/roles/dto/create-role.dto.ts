import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    @ApiProperty({ description: "Role name" })
    readonly name: string;
}

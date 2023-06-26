import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    readonly name: string;
}

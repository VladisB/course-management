import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsEmail()
    @IsOptional()
    @ApiProperty({ description: "User email", required: false })
    email?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password too weak",
    })
    @IsOptional()
    @ApiProperty({ description: "User password", required: false })
    password?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
    @ApiProperty({ description: "User first name", required: false })
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
    @ApiProperty({ description: "User last name", required: false })
    lastName?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ description: "User role id", required: false, minimum: 1 })
    roleId?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ description: "User group id", required: false, minimum: 1 })
    groupId?: number;
}

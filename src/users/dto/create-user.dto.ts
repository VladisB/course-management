import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase().trim())
    @ApiProperty({ description: "User email" })
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password too weak",
    })
    @ApiProperty({ description: "User password" })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @ApiProperty({ description: "User first name" })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @ApiProperty({ description: "User last name" })
    lastName: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "User role id", required: false })
    roleId?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "User group id", required: false })
    groupId?: number;
}

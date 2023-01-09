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
    @MaxLength(25)
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password too weak",
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    lastName: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;

    @IsNumber()
    @IsOptional()
    groupId?: number;
}

import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password too weak",
    })
    password?: string;

    @IsNumber()
    roleId?: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    lastName?: string;
}

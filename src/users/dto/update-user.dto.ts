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

export class UpdateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "password too weak",
    })
    @IsOptional()
    password?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
    lastName?: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;

    @IsNumber()
    @IsOptional()
    groupId?: number;
}

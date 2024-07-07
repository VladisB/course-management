import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class AuthSignUpDto {
    @IsString()
    @MinLength(4)
    @MaxLength(100)
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
}

import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

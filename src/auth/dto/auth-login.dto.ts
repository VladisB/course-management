import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase().trim())
    @ApiProperty({ example: "johndoe@gmail.com", description: "Email" })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Password" })
    password: string;
}

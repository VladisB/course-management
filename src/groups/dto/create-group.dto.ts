import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    facultyId: number;
}

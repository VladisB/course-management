import { ApiProperty } from "@nestjs/swagger";

export class UserViewModel {
    @ApiProperty({ description: "User id" })
    id: number;

    @ApiProperty({ description: "User email" })
    email: string;

    @ApiProperty({ description: "User first name" })
    firstName: string;

    @ApiProperty({ description: "User last name" })
    lastName: string;

    @ApiProperty({ description: "User role name" })
    role: string;

    @ApiProperty({ description: "User group name" })
    group: string | null;
}

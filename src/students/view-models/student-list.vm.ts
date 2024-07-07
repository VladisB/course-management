import { ApiProperty } from "@nestjs/swagger";

class StudentListViewModel {
    @ApiProperty({ description: "Student id" })
    id: number;

    @ApiProperty({ description: "Student email" })
    email: string;

    @ApiProperty({ description: "Student first name" })
    firstName: string;

    @ApiProperty({ description: "Student last name" })
    lastName: string;

    @ApiProperty({ description: "Student group name" })
    group: string | null;
}

export { StudentListViewModel };

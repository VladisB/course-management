import { ApiProperty } from "@nestjs/swagger";

export class FacultyViewModel {
    @ApiProperty({ description: "Faculty id" })
    id: number;

    @ApiProperty({ description: "Faculty name" })
    name: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class HomeworkViewModel {
    @ApiProperty({ description: "Homework id" })
    id: number;

    @ApiProperty({ description: "Student id" })
    studentId: number;

    @ApiProperty({ description: "Student name" })
    studentName: string;

    @ApiProperty({ description: "Student last name" })
    studentLastName: string;

    @ApiProperty({ description: "Download URL" })
    downloadURL: string | null;

    @ApiProperty({ description: "Email of creator" })
    createdBy: string;

    @ApiProperty({ description: "Email of modifier" })
    modifiedBy: string;

    @ApiProperty({ description: "Created at" })
    createdAt: Date;

    @ApiProperty({ description: "Modified at" })
    modifiedAt: Date;
}

import { ApiProperty } from "@nestjs/swagger";

export class CourseInstructorListItemViewModel {
    @ApiProperty({ description: "Instructor id" })
    instructorId: number;

    @ApiProperty({ description: "Instructor first name" })
    firstName: string;

    @ApiProperty({ description: "Instructor last name" })
    lastName: string;
}

export class CourseViewModel {
    @ApiProperty({ description: "Course id" })
    id: number;

    @ApiProperty({ description: "Course name" })
    name: string;

    @ApiProperty({ description: "Instructor list", type: [CourseInstructorListItemViewModel] })
    instructorList: CourseInstructorListItemViewModel[];
}

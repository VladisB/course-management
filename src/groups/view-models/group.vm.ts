import { ApiProperty } from "@nestjs/swagger";

export class GroupCoursesViewModel {
    @ApiProperty({ description: "Course id" })
    id: number;

    @ApiProperty({ description: "Course name" })
    name: string;
}

export class GroupViewModel {
    @ApiProperty({ description: "Group id" })
    id: number;

    @ApiProperty({ description: "Group name" })
    groupName: string;

    @ApiProperty({ description: "Faculty name" })
    facultyName: string;

    @ApiProperty({ description: "Course list", type: [GroupCoursesViewModel] })
    courses: GroupCoursesViewModel[];
}

import { ApiProperty } from "@nestjs/swagger";

class DataListResponse<T> {
    @ApiProperty({ type: [Object], description: "List of records" })
    public records: T[];

    @ApiProperty({ description: "Total records", example: 1 })
    public totalRecords: number;

    constructor(records: T[], totalRecords: number) {
        this.records = records ?? [];
        this.totalRecords = totalRecords ?? null;
    }
}

export { DataListResponse };

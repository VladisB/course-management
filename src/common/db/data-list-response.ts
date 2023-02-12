class DataListResponse<T> {
    public records: T[];
    public totalRecords: number;

    constructor(records: T[], totalRecords: number) {
        this.records = records ?? [];
        this.totalRecords = totalRecords ?? null;
    }
}

export { DataListResponse };

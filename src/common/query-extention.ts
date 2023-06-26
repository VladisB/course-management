import { HttpException, HttpStatus } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm";
import { ColumnType, QueryParamsDTO, SortDirection } from "./dto/query-params.dto";

export interface Sort {
    apply: boolean;
    direction: SortDirection;
}

export interface Column {
    name: string;
    prop: string;
    tableName: string;
    isSearchable: boolean;
    isSortable: boolean;
    search?: string;
    sort?: Sort;
    type: ColumnType;
}

export interface DatatablesConfig {
    columns: Column[];
}

export class ApplyToQueryExtension {
    public static async applyToQuery<TRecord>(
        request: QueryParamsDTO,
        query: SelectQueryBuilder<TRecord>,
        config: DatatablesConfig,
    ): Promise<[TRecord[], number]> {
        this.mapColumnValues(request, config);

        query = this.applySearchExpression(query, config);
        query = this.applySortExpression(query, config);
        query = this.applyPagination(request, query);

        const [users, count] = await query.getManyAndCount();

        return [users, count];
    }

    private static applySortExpression<TRecord>(
        query: SelectQueryBuilder<TRecord>,
        config: DatatablesConfig,
    ): SelectQueryBuilder<TRecord> {
        const sortableColumns = config.columns.filter((column) => column.isSortable);

        if (!sortableColumns.length) return query;

        const sortByColumn = sortableColumns.find((column) => column.sort.apply === true);

        if (sortByColumn) {
            const columnName = sortByColumn.prop;
            const order = sortByColumn.sort.direction;
            const table = sortByColumn.tableName;
            const orderBy = `${table}.${columnName}`;

            query.orderBy(orderBy, order);
        }

        return query;
    }

    private static applyPagination<TRecord>(
        request: QueryParamsDTO,
        query: SelectQueryBuilder<TRecord>,
    ): SelectQueryBuilder<TRecord> {
        const take = request.limit || 10;
        const page = request.page || 1;
        const skip = (page - 1) * take;

        if (request.limit > 0) query = query.limit(take).offset(skip);

        return query;
    }

    private static applySearchExpression<TRecord>(
        query: SelectQueryBuilder<TRecord>,
        config: DatatablesConfig,
    ): SelectQueryBuilder<TRecord> {
        const searchableColumns = config.columns.filter((column) => column.isSearchable);

        searchableColumns.forEach((column) => {
            if (column.search) {
                const columnName = column.prop;
                const table = column.tableName;

                if (column.type === ColumnType.Text) {
                    query.where(`${table}.${columnName} iLike :search`, {
                        search: `%${column.search}%`,
                    });
                } else if (column.type === ColumnType.Integer || column.type === ColumnType.Date) {
                    query.where(`${table}.${columnName} = :search`, {
                        search: column.search,
                    });
                }
            }
        });

        return query;
    }

    private static mapColumnValues(request: QueryParamsDTO, config: DatatablesConfig): void {
        if (config.columns.length > 0) {
            this.validateColumnValues(request, config);

            const {
                search = "",
                searchBy = "",
                sortBy = "",
                sortType = SortDirection.ASC,
            } = request;

            config.columns.forEach((col) => {
                this.setSearchValue(col, searchBy, search);
                this.setSortValue(col, sortBy, sortType);
            });
        }
    }

    private static setSearchValue(column: Column, searchBy: string, search: string): void {
        // set column search value
        column.search = column.name === searchBy ? search : "";
    }

    private static setSortValue(column: Column, sortBy: string, sortType: SortDirection): void {
        const sort: Sort = {
            apply: false,
            direction: SortDirection.ASC,
        };

        // set default sort value
        if (column.sort && !sortBy) {
            sort.apply = column.sort.apply;
            sort.direction = column.sort.direction;
        }

        // set column sort value
        if (column.name === sortBy) {
            sort.apply = true;
            sort.direction = sortType;
        }

        column.sort = sort;
    }

    private static validateColumnValues(
        queryParams: QueryParamsDTO,
        configuration: DatatablesConfig,
    ) {
        const { columns } = configuration;
        if (!columns.length) return;

        const { searchBy, sortBy } = queryParams;

        if (searchBy) {
            const searchColumn = columns.find((column) => column.name === searchBy);

            if (!searchColumn) {
                throw new HttpException(
                    `Invalid datatables column '${searchBy}'.`,
                    HttpStatus.BAD_REQUEST,
                );
            } else if (!searchColumn.isSearchable) {
                throw new HttpException(
                    `Searching by datatables column '${searchBy}' is disabled.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        if (sortBy) {
            const sortColumn = columns.find((column) => column.name === sortBy);

            if (!sortColumn) {
                throw new HttpException(
                    `Invalid datatables column '${sortBy}'.`,
                    HttpStatus.BAD_REQUEST,
                );
            } else if (!sortColumn.isSortable) {
                throw new HttpException(
                    `Sorting by datatables column '${sortBy}' is disabled.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }
}

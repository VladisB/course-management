import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

// TODO: Move this to a separate file
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

export enum ColumnType {
    Integer = "integer",
    Text = "text",
}

export class QueryParamsDTO {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @Transform(({ value }) => value?.toLowerCase().trim())
    search?: string;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    searchBy?: string;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase().trim())
    @IsEnum(SortDirection)
    sortType?: SortDirection;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    sortBy?: string;
}

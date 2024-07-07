import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

// TODO: Move this to a separate file
export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

export enum ColumnType {
    Integer = "integer",
    Text = "text",
    Date = "date",
}

export class QueryParamsDTO {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ example: 1, description: "Page number", required: false })
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ example: 10, description: "Page size", required: false })
    limit?: number;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @Transform(({ value }) => value?.toLowerCase().trim())
    @ApiProperty({ description: "Search phrase", required: false })
    search?: string;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @ApiProperty({ description: "Search by column", required: false })
    searchBy?: string;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase().trim())
    @IsEnum(SortDirection)
    @ApiProperty({ example: "ASC", description: "Sort type", enum: SortDirection, required: false })
    sortType?: SortDirection;

    @IsString()
    @MaxLength(25)
    @MinLength(1)
    @IsOptional()
    @ApiProperty({ description: "Sort by column", required: false })
    sortBy?: string;
}

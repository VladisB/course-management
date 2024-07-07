import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import {
    ErrorResponseNotFoundDto,
    ErrorResponseBaseDto,
    ErrorResponseForbiddenDto,
    ErrorResponseUnauthorizedDto,
    ErrorResponseInternalServerErrorDto,
    ErrorResponseConflictDto,
} from "../dto/error-response.dto";
import { applyDecorators } from "@nestjs/common";
import { QueryParamsDTO } from "../dto/query-params.dto";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

function CommonApiResponseBadRequest() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: "Bad request",
            type: ErrorResponseBaseDto,
        }),
    );
}

function CommonApiResponseNotFound() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.NOT_FOUND,
            type: ErrorResponseNotFoundDto,
            description: "Not Found",
        }),
    );
}

function CommonApiResponseForbidden() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.FORBIDDEN,
            type: ErrorResponseForbiddenDto,
            description: "Forbidden",
        }),
    );
}

function CommonApiResponseUnauthorized() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            type: ErrorResponseUnauthorizedDto,
            description: "Unauthorized",
        }),
    );
}

function CommonApiResponseInternalServerError() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            type: ErrorResponseInternalServerErrorDto,
            description: "Internal Server Error",
        }),
    );
}

function CommonApiResponseConflict() {
    return applyDecorators(
        ApiResponse({
            status: HttpStatus.CONFLICT,
            type: ErrorResponseConflictDto,
            description: "Conflict",
        }),
    );
}

function CommonApiQuery() {
    return applyDecorators(ApiQuery({ type: QueryParamsDTO }));
}

const OpenApiPaginationResponse = (model: any, description: string) => {
    // NOTE: This is a workaround for swagger not supporting generics. Discribing DataListResponse<T> as a schema
    return applyDecorators(
        ApiOkResponse({
            schema: {
                properties: {
                    records: {
                        type: "array",
                        items: { $ref: getSchemaPath(model) },
                    },
                    totalRecords: {
                        type: "number",
                    },
                },
                required: ["records", "totalRecords"],
            },
            description,
        }),
    );
};

export {
    CommonApiResponseBadRequest,
    CommonApiResponseNotFound,
    CommonApiResponseForbidden,
    CommonApiResponseUnauthorized,
    CommonApiResponseInternalServerError,
    CommonApiResponseConflict,
    CommonApiQuery,
    OpenApiPaginationResponse,
};

import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";

export class ErrorResponseBaseDto {
    @ApiProperty({ example: HttpStatus.BAD_REQUEST, description: "Status code of the error" })
    statusCode: number;

    // NOTE: Will be overwritten in extended classes
    @ApiProperty({
        example: ["error message"],
        description: "Error message or messages",
        isArray: true,
    })
    message: string[] | string;

    @ApiProperty({ example: "2023-11-18T14:32:20.987Z", description: "Timestamp of the error" })
    timestamp: string;

    @ApiProperty({ example: "/resource/name", description: "API path where the error occurred" })
    path: string;
}

export class ErrorResponseNotFoundDto extends ErrorResponseBaseDto {
    @ApiProperty({ example: HttpStatus.NOT_FOUND, description: "Status code of the error" })
    statusCode: number;

    @ApiProperty({
        example: "The specified resource was not found.",
        description: "Error message or messages",
        isArray: true,
    })
    message: string;
}

export class ErrorResponseForbiddenDto extends ErrorResponseBaseDto {
    @ApiProperty({ example: HttpStatus.FORBIDDEN, description: "Status code of the error" })
    statusCode: number;

    @ApiProperty({
        example: "Forbidden resource",
        description: "Error message or messages",
        isArray: true,
    })
    message: string;
}

export class ErrorResponseUnauthorizedDto extends ErrorResponseBaseDto {
    @ApiProperty({ example: HttpStatus.UNAUTHORIZED, description: "Status code of the error" })
    statusCode: number;

    @ApiProperty({
        example: "Unauthorized",
        description: "Error message or messages",
        isArray: true,
    })
    message: string;
}

export class ErrorResponseInternalServerErrorDto extends ErrorResponseBaseDto {
    @ApiProperty({
        example: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Status code of the error",
    })
    statusCode: number;

    @ApiProperty({
        example: "Internal server error",
        description: "Error message or messages",
        isArray: true,
    })
    message: string;
}

export class ErrorResponseConflictDto extends ErrorResponseBaseDto {
    @ApiProperty({ example: HttpStatus.CONFLICT, description: "Status code of the error" })
    statusCode: number;

    @ApiProperty({
        example: "Conflict",
        description: "Error message or messages",
        isArray: true,
    })
    message: string;
}

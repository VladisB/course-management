import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { BadRequestException } from "@nestjs/common";
import { FileMimeType } from "@common/enum";
import { FileValidationPipe } from "../pipes";

describe("FileValidationPipe", () => {
    let pipe: FileValidationPipe;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileValidationPipe,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(5), // assuming 5MB as default size for testing
                    },
                },
            ],
        }).compile();

        pipe = module.get<FileValidationPipe>(FileValidationPipe);
        configService = module.get<ConfigService>(ConfigService);
    });

    it("should be defined", () => {
        expect(pipe).toBeDefined();
    });

    it("should throw an error if no file is provided", () => {
        expect(() => pipe.transform(undefined, null)).toThrow(BadRequestException);
    });

    it("should throw an error if file size exceeds limit", () => {
        const mockFile = {
            size: 6 * 1024 * 1024, // 6MB
            mimetype: FileMimeType.PDF,
        };
        expect(() => pipe.transform(mockFile as any, null)).toThrow(BadRequestException);
    });

    it("should throw an error for invalid file type", () => {
        const mockFile = {
            size: 1 * 1024 * 1024, // 1MB
            mimetype: "image/jpeg",
        };
        expect(() => pipe.transform(mockFile as any, null)).toThrow(BadRequestException);
    });

    it("should return the file if it is valid", () => {
        const mockFile = {
            size: 1 * 1024 * 1024, // 1MB
            mimetype: FileMimeType.PDF,
        };
        expect(pipe.transform(mockFile as any, null)).toEqual(mockFile);
    });
});

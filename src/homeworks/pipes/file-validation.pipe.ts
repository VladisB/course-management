import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileMimeType } from "@common/enum";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    constructor(private configService: ConfigService) {}

    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!file) throw new BadRequestException("File is required");

        const maxSize = this.configService.get<number>("app.uploadFileSizeLimitMb") * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(`File size should be less than ${maxSize}`);
        }

        if (file.mimetype !== FileMimeType.PDF) {
            throw new BadRequestException("Invalid file type. Only PDF is allowed");
        }

        return file;
    }
}

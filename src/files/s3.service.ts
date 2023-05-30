import { Injectable } from "@nestjs/common";
import { IFilesService } from "./files.service.interface";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service implements IFilesService {
    private s3: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>("aws.s3Region"),
            credentials: {
                accessKeyId: this.configService.get<string>("aws.accessKeyId"),
                secretAccessKey: this.configService.get<string>("aws.secretAccessKey"),
            },
        });
    }

    async uploadFile(
        bucketName: string,
        objectKey: string,
        body: Uint8Array | Buffer,
        contentType?: string,
    ): Promise<void> {
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Body: body,
            ContentType: contentType,
        };

        await this.s3.send(new PutObjectCommand(params));
    }
}

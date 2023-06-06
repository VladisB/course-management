import { Injectable } from "@nestjs/common";
import { IFilesService } from "./files.service.interface";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    public async deleteObject(bucketName: string, objectKey: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });

        await this.s3.send(command);
    }

    public async getSignedReadUrl(
        bucketName: string,
        objectKey: string,
        expiryTimeInSeconds: number,
    ): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });

        const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: expiryTimeInSeconds });

        return signedUrl;
    }
}

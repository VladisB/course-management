import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { IFilesService } from "./files.service.interface";
import { ConfigModule } from "@nestjs/config";

@Module({
    providers: [
        {
            provide: IFilesService,
            useClass: S3Service,
        },
    ],
    exports: [IFilesService],
    imports: [ConfigModule],
})
export class FilesModule {}

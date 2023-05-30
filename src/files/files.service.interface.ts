export abstract class IFilesService {
    abstract uploadFile(
        bucketName: string,
        objectKey: string,
        body: Uint8Array | Buffer,
        contentType?: string,
    ): Promise<void>;
}

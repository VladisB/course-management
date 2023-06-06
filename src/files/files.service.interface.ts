export abstract class IFilesService {
    abstract uploadFile(
        bucketName: string,
        objectKey: string,
        body: Uint8Array | Buffer,
        contentType?: string,
    ): Promise<void>;
    abstract deleteObject(bucketName: string, objectKey: string): Promise<void>;
    abstract getSignedReadUrl(
        bucketName: string,
        objectKey: string,
        expiryTimeInSeconds: number,
    ): Promise<string>;
}

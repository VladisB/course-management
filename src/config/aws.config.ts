import { registerAs } from "@nestjs/config";

export default registerAs("aws", () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Region: process.env.AWS_S3_REGION,
    s3UrlEpiresInMin: parseInt(process.env.AWS_S3_URL_EXPIRES_IN_MIN) || 15,
    appBucketName: process.env.AWS_APP_BUCKET_NAME,
}));

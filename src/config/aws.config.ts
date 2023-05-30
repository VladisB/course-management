import { registerAs } from "@nestjs/config";

export default registerAs("aws", () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Region: process.env.AWS_S3_REGION,
    appBucketName: process.env.AWS_APP_BUCKET_NAME,
}));

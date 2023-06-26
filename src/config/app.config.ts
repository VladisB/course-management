import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT) || 3000,
    jwt: process.env.APP_JWT,
    accessTokenExpiresIn: process.env.APP_ACCESS_TOKEN_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.APP_REFRESH_TOKEN_EXPIRES_IN || "1d",
    uploadRateLimitTTL: process.env.APP_UPLOAD_RATE_LIMIT_TTL || 60,
    uploadRateLimit: process.env.APP_UPLOAD_RATE_LIMIT || 3,
    uploadFileSizeLimitMb: process.env.APP_UPLOAD_FILE_SIZE_LIMIT_MB || 2,
}));

import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT) || 3000,
    jwt: process.env.APP_JWT,
}));

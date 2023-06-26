import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    host: process.env.PG_HOST,
    name: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    synchronize: process.env.PG_SYNCHRONIZE === "true",
    type: process.env.DB_TYPE,
    username: process.env.PG_USER,
}));

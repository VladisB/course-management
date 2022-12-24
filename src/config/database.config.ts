import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    username: process.env.PG_USER,
    type: process.env.DB_TYPE,
    synchronize: process.env.PG_SYNCHRONIZE === "true",
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    name: process.env.PG_DATABASE,
}));

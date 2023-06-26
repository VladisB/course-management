import { Injectable } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";

@Injectable()
export class MigrationDataSourceConfigService {
    public createOptions(): DataSourceOptions {
        return {
            database: process.env.PG_DATABASE,
            entities: [__dirname + "/../**/*.entity{.ts,.js}"],
            host: process.env.PG_HOST,
            logging: true,
            password: process.env.PG_PASSWORD,
            port: parseInt(process.env.PG_PORT, 10) || 5432,
            synchronize: false,
            type: process.env.DB_TYPE,
            username: process.env.PG_USER,
            migrations: [__dirname + "/migrations/*{.ts,.js}"],
            migrationsTableName: "typeorm_migrations",
            cli: {
                migrationsDir: `/migrations`,
            },
        } as DataSourceOptions;
    }
}

const dataSourceConfigService = new MigrationDataSourceConfigService();

const dataSource = new DataSource(dataSourceConfigService.createOptions());

export default dataSource;

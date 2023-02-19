import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            database: this.configService.get<string>("database.name"),
            entities: [__dirname + "/../**/*.entity{.ts,.js}"],
            host: this.configService.get<string>("database.host"),
            logging: this.configService.get<string>("app.nodeEnv") !== "production",
            password: this.configService.get<string>("database.password"),
            port: this.configService.get<number>("database.port"),
            synchronize: false,
            type: this.configService.get<string>("database.type"),
            username: this.configService.get<string>("database.username"),
        } as TypeOrmModuleOptions;
    }
}

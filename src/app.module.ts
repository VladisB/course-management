import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import databaseConfig from "./config/database.config";
import appConfig from "./config/app.config";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { FacultiesModule } from "./faculties/faculties.module";
import { GroupsModule } from "./groups/groups.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig],
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        UsersModule,
        RolesModule,
        AuthModule,
        FacultiesModule,
        GroupsModule,
    ],
    controllers: [],
    providers: [TypeOrmConfigService],
})
export class AppModule {}

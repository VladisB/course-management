import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import databaseConfig from "./config/database.config";
import appConfig from "./config/app.config";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { FacultiesModule } from "./faculties/faculties.module";
import { GroupsModule } from "./groups/groups.module";
import { DatabaseModule } from "./database/database.module";
import { CoursesModule } from "./courses/courses.module";
import { LessonsModule } from "./lessons/lessons.module";
import { StudentCoursesModule } from "./student-courses/student-courses.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig],
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        FacultiesModule,
        GroupsModule,
        DatabaseModule,
        CoursesModule,
        LessonsModule,
        StudentCoursesModule,
    ],
    controllers: [],
    providers: [TypeOrmConfigService],
})
export class AppModule {}

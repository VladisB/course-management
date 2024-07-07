import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersManagementModule } from "./users-management/users-management.module";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import databaseConfig from "./config/database.config";
import appConfig from "./config/app.config";
import awsConfig from "./config/aws.config";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { FacultiesModule } from "./faculties/faculties.module";
import { GroupsModule } from "./groups/groups.module";
import { DatabaseModule } from "./database/database.module";
import { CoursesModule } from "./courses/courses.module";
import { LessonsModule } from "./lessons/lessons.module";
import { StudentCoursesModule } from "./student-courses/student-courses.module";
import { CourseInstructorsModule } from "./course-instructors/course-instructors.module";
import { UsersModule } from "./users/users.module";
import { StudentsModule } from "./students/students.module";
import { LessonGradesModule } from "./lesson-grades/lesson-grades.module";
import { HomeWorksModule } from "./homeworks/homeworks.module";
import { FilesModule } from "./files/files.module";
import { HealthController } from "./health/health.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, appConfig, awsConfig],
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        RolesModule,
        AuthModule,
        FacultiesModule,
        GroupsModule,
        DatabaseModule,
        CoursesModule,
        LessonsModule,
        StudentCoursesModule,
        CourseInstructorsModule,
        UsersManagementModule,
        UsersModule,
        StudentsModule,
        LessonGradesModule,
        HomeWorksModule,
        FilesModule,
    ],
    controllers: [HealthController],
    providers: [TypeOrmConfigService],
})
export class AppModule {}

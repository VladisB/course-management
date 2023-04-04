import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { StudentCoursesController } from "./student-courses.controller";
import { StudentCoursesService } from "./student-courses.service";

import { StudentCourses } from "./entities/student-courses.entity";
import { StudentCoursesRepository } from "./student-courses.repository";
import { CoursesModule } from "src/courses/courses.module";
import { UsersModule } from "src/users/users.module";
import { StudentCoursesViewModelFactory } from "./model-factories/student-courses";

@Module({
    controllers: [StudentCoursesController],
    providers: [StudentCoursesService, StudentCoursesRepository, StudentCoursesViewModelFactory],
    imports: [
        TypeOrmModule.forFeature([StudentCourses]),
        RolesModule,
        AuthModule,
        CoursesModule,
        UsersModule,
    ],
    exports: [StudentCoursesService],
})
export class StudentCoursesModule {}

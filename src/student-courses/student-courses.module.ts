import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { StudentCoursesController } from "./student-courses.controller";
import { StudentCoursesService } from "./student-courses.service";

import { StudentCourses } from "./entities/student-courses.entity";
import { IStudentCoursesRepository, StudentCoursesRepository } from "./student-courses.repository";
import { CoursesModule } from "src/courses/courses.module";
import { StudentCoursesViewModelFactory } from "./model-factories/student-courses";
import { UsersModule } from "src/users/users.module";

@Module({
    controllers: [StudentCoursesController],
    providers: [
        StudentCoursesService,
        { provide: IStudentCoursesRepository, useClass: StudentCoursesRepository },
        StudentCoursesViewModelFactory,
    ],
    imports: [TypeOrmModule.forFeature([StudentCourses]), RolesModule, CoursesModule, UsersModule],
    exports: [IStudentCoursesRepository],
})
export class StudentCoursesModule {}

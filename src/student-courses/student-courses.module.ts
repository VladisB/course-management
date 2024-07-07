import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentCoursesController } from "./student-courses.controller";
import { StudentCoursesService } from "./student-courses.service";

import { StudentCourses } from "./entities/student-courses.entity";
import { IStudentCoursesRepository, StudentCoursesRepository } from "./student-courses.repository";
import { CoursesModule } from "@app/courses/courses.module";
import { StudentCoursesViewModelFactory } from "./model-factories/student-courses";
import { UsersModule } from "@app/users/users.module";

@Module({
    controllers: [StudentCoursesController],
    providers: [
        StudentCoursesService,
        { provide: IStudentCoursesRepository, useClass: StudentCoursesRepository },
        StudentCoursesViewModelFactory,
    ],
    imports: [TypeOrmModule.forFeature([StudentCourses]), CoursesModule, UsersModule],
    exports: [IStudentCoursesRepository],
})
export class StudentCoursesModule {}

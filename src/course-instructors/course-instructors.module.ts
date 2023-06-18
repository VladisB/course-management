import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import {
    CourseInstructorsRepository,
    ICourseInstructorsRepository,
} from "./course-instructors.repository";
import { CoursesController } from "./course-instructors.controller";
import { CourseInstructors } from "./entities/course-instructors.entity";
import { CourseInstructorsViewModelFactory } from "./model-factories";
import { UsersModule } from "@app/users/users.module";
import { CourseInstructorsService } from "./course-instructors.service";
import { CoursesModule } from "@app/courses/courses.module";

@Module({
    controllers: [CoursesController],
    providers: [
        { provide: ICourseInstructorsRepository, useClass: CourseInstructorsRepository },
        CourseInstructorsViewModelFactory,
        CourseInstructorsService,
    ],
    imports: [
        TypeOrmModule.forFeature([CourseInstructors]),
        RolesModule,
        UsersModule,
        CoursesModule,
    ],
    exports: [ICourseInstructorsRepository],
})
export class CourseInstructorsModule {}

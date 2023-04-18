import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { CourseInstructorsRepository } from "./course-instructors.repository";
import { CoursesController } from "./course-instructors.controller";
import { CourseInstructors } from "./entities/course-instructors.entity";
import { CourseInstructorsViewModelFactory } from "./model-factories";
import { UsersModule } from "src/users/users.module";
import { CourseInstructorsService } from "./course-instructors.service";
import { CoursesModule } from "src/courses/courses.module";

@Module({
    controllers: [CoursesController],
    providers: [
        CourseInstructorsRepository,
        CourseInstructorsViewModelFactory,
        CourseInstructorsService,
    ],
    imports: [
        TypeOrmModule.forFeature([CourseInstructors]),
        RolesModule,
        UsersModule,
        CoursesModule,
    ],
    exports: [CourseInstructorsService],
})
export class CourseInstructorsModule {}

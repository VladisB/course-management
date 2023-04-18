import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { CourseInstructorsRepository } from "./course-instructors.repository";
import { CoursesController } from "./courses.controller";
import { CoursesRepository, ICoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { CourseInstructors } from "./entities/course-to-instructor.entity";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";

@Module({
    controllers: [CoursesController],
    providers: [
        CoursesService,
        { provide: ICoursesRepository, useClass: CoursesRepository },
        CourseInstructorsRepository,
        CoursesViewModelFactory,
    ],
    imports: [TypeOrmModule.forFeature([Course, CourseInstructors]), RolesModule],
    exports: [ICoursesRepository],
})
export class CoursesModule {}

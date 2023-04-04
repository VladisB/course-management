import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { CourseInstructorsRepository } from "./course-instructors.repository";
import { CoursesController } from "./courses.controller";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { CourseInstructors } from "./entities/course-to-instructor.entity";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";
import { GroupsModule } from "src/groups/groups.module";
import { StudentCoursesModule } from "src/user-courses/student-courses.module";

@Module({
    controllers: [CoursesController],
    providers: [
        CoursesService,
        CoursesRepository,
        CourseInstructorsRepository,
        CoursesViewModelFactory,
    ],
    imports: [
        TypeOrmModule.forFeature([Course, CourseInstructors]),
        RolesModule,
        AuthModule,
        forwardRef(() => UsersModule),
        forwardRef(() => StudentCoursesModule),
        // UsersModule,
        // StudentCoursesModule,
    ],
    exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}

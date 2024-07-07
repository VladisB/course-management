import { ILessonGradesRepository, LessonGradesRepository } from "./lesson-grades.repository";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { LessonGradesController } from "./lesson-grades.controller";
import { LessonGradesService } from "./lesson-grades.service";
import { LessonGradesViewModelFactory } from "./model-factories";
import { LessonsModule } from "@app/lessons/lessons.module";
import { Module } from "@nestjs/common";
import { StudentCoursesModule } from "@app/student-courses/student-courses.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@app/users/users.module";

@Module({
    controllers: [LessonGradesController],
    imports: [
        TypeOrmModule.forFeature([LessonGrades]),
        LessonsModule,
        UsersModule,
        StudentCoursesModule,
    ],
    providers: [
        LessonGradesService,
        LessonGradesViewModelFactory,
        {
            provide: ILessonGradesRepository,
            useClass: LessonGradesRepository,
        },
    ],
})
export class LessonGradesModule {}

import { Module } from "@nestjs/common";
import { LessonGradesService } from "./lesson-grades.service";
import { LessonGradesController } from "./lesson-grades.controller";
import { ILessonGradesRepository, LessonGradesRepository } from "./lesson-grades.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonGrades } from "./entities/lesson-grade.entity";
import { LessonsModule } from "src/lessons/lessons.module";
import { UsersModule } from "src/users/users.module";
import { LessonGradesViewModelFactory } from "./model-factories";

@Module({
    controllers: [LessonGradesController],
    imports: [TypeOrmModule.forFeature([LessonGrades]), LessonsModule, UsersModule],
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

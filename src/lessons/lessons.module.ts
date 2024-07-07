import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { ILessonsRepository, LessonsRepository } from "./lessons.repository";
import { Lesson } from "./entities/lesson.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonViewModelFactory } from "./model-factories";
import { CoursesModule } from "@app/courses/courses.module";

@Module({
    controllers: [LessonsController],
    imports: [TypeOrmModule.forFeature([Lesson]), CoursesModule],
    providers: [
        { provide: ILessonsRepository, useClass: LessonsRepository },
        LessonsService,
        LessonViewModelFactory,
    ],
    exports: [ILessonsRepository],
})
export class LessonsModule {}

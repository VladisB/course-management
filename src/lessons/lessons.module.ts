import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { ILessonsRepository, LessonsRepository } from "./lessons.repository";
import { Lesson } from "./entities/lesson.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonsViewModelFactory } from "./model-factories";
import { CoursesModule } from "src/courses/courses.module";

@Module({
    controllers: [LessonsController],
    imports: [TypeOrmModule.forFeature([Lesson]), CoursesModule],
    providers: [
        { provide: ILessonsRepository, useClass: LessonsRepository },
        LessonsService,
        LessonsViewModelFactory,
    ],
    exports: [ILessonsRepository],
})
export class LessonsModule {}

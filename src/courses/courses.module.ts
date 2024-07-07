import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { CoursesController } from "./courses.controller";
import { CoursesRepository, ICoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";

@Module({
    controllers: [CoursesController],
    providers: [
        CoursesService,
        { provide: ICoursesRepository, useClass: CoursesRepository },
        CoursesViewModelFactory,
    ],
    imports: [TypeOrmModule.forFeature([Course]), RolesModule],
    exports: [ICoursesRepository],
})
export class CoursesModule {}

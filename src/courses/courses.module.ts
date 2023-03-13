import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { CoursesController } from "./courses.controller";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { Course } from "./entities/course.entity";
import { CoursesViewModelFactory } from "./model-factories";

@Module({
    controllers: [CoursesController],
    providers: [CoursesService, CoursesRepository, CoursesViewModelFactory],
    imports: [TypeOrmModule.forFeature([Course]), RolesModule, AuthModule, UsersModule],
    exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}

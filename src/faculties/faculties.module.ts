import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { FacultiesController } from "./faculties.controller";
import { FacultiesService } from "./faculties.service";
import { Faculty } from "./entities/faculty.entity";
import { FacultiesRepository } from "./faculties.repository";
import { FacultiesViewModelFactory } from "./model-factories";

@Module({
    controllers: [FacultiesController],
    providers: [FacultiesService, FacultiesRepository, FacultiesViewModelFactory],
    imports: [TypeOrmModule.forFeature([Faculty]), RolesModule, AuthModule],
    exports: [FacultiesService, FacultiesRepository],
})
export class FacultiesModule {}

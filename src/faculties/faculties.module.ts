import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { FacultiesController } from "./faculties.controller";
import { FacultiesService } from "./faculties.service";
import { Faculty } from "./entities/faculty.entity";
import { FacultiesRepository, IFacultiesRepository } from "./faculties.repository";
import { FacultiesViewModelFactory } from "./model-factories";

@Module({
    controllers: [FacultiesController],
    providers: [
        FacultiesService,
        { provide: IFacultiesRepository, useClass: FacultiesRepository },
        FacultiesViewModelFactory,
    ],
    imports: [TypeOrmModule.forFeature([Faculty]), RolesModule],
    exports: [IFacultiesRepository],
})
export class FacultiesModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { FacultiesController } from "./faculties.controller";
import { FacultiesService } from "./faculties.service";
import { Faculty } from "./faculty.entity";

@Module({
    controllers: [FacultiesController],
    providers: [FacultiesService],
    imports: [RolesModule, AuthModule, TypeOrmModule.forFeature([Faculty])],
})
export class FacultiesModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FacultiesModule } from "../faculties/faculties.module";
import { AuthModule } from "../auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { Group } from "./entities/group.entity";
import { GroupsController } from "./groups.controller";
import { GroupsRepository } from "./groups.repository";
import { GroupsService } from "./groups.service";
import { GroupsViewModelFactory } from "./model-factories";

@Module({
    controllers: [GroupsController],
    providers: [GroupsService, GroupsRepository, GroupsViewModelFactory],
    imports: [FacultiesModule, RolesModule, AuthModule, TypeOrmModule.forFeature([Group])],
})
export class GroupsModule {}

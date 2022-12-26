import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { FacultiesModule } from "../faculties/faculties.module";
import { RolesModule } from "../roles/roles.module";
import { Group } from "./group.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";

@Module({
    controllers: [GroupsController],
    providers: [GroupsService],
    imports: [RolesModule, AuthModule, TypeOrmModule.forFeature([Group]), FacultiesModule],
})
export class GroupsModule {}

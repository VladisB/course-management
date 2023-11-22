import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FacultiesModule } from "../faculties/faculties.module";
import { RolesModule } from "../roles/roles.module";
import { Group } from "./entities/group.entity";
import { GroupsController } from "./groups.controller";
import { GroupsRepository, IGroupsRepository } from "./groups.repository";
import { GroupsService } from "./groups.service";
import { GroupsViewModelFactory } from "./model-factories";
import { CoursesModule } from "@app/courses/courses.module";
import { GroupCourses } from "./entities/group-courses.entity";
import { GroupCoursesRepository, IGroupCoursesRepository } from "./group-courses.repository";

@Module({
    controllers: [GroupsController],
    imports: [
        TypeOrmModule.forFeature([Group, GroupCourses]),
        FacultiesModule,
        RolesModule,
        CoursesModule,
    ],
    providers: [
        GroupsService,
        { provide: IGroupsRepository, useClass: GroupsRepository },
        { provide: IGroupCoursesRepository, useClass: GroupCoursesRepository },
        GroupCoursesRepository,
        GroupsViewModelFactory,
    ],
    exports: [IGroupsRepository],
})
export class GroupsModule {}

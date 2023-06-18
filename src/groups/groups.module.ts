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
import { GroupCourses } from "./entities/group-to-course.entity";
import { GroupCoursesRepository } from "./group-courses.repository";

@Module({
    controllers: [GroupsController],
    providers: [
        GroupsService,
        { provide: IGroupsRepository, useClass: GroupsRepository },
        GroupCoursesRepository,
        GroupsViewModelFactory,
    ],
    imports: [
        FacultiesModule,
        RolesModule,
        CoursesModule,
        TypeOrmModule.forFeature([Group, GroupCourses]),
    ],
    exports: [IGroupsRepository],
})
export class GroupsModule {}

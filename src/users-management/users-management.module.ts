import { Module } from "@nestjs/common";
import { UsersController } from "./users-management.controller";
import { RolesModule } from "../roles/roles.module";
import { GroupsModule } from "src/groups/groups.module";
import { UsersModule } from "src/users/users.module";
import { IUsersManagementService, UsersManagementService } from "./users-management.service";
import { StudentCoursesModule } from "src/student-courses/student-courses.module";

@Module({
    controllers: [UsersController],
    providers: [
        {
            provide: IUsersManagementService,
            useClass: UsersManagementService,
        },
    ],
    imports: [UsersModule, RolesModule, GroupsModule, StudentCoursesModule],
    exports: [IUsersManagementService],
})
export class UsersManagementModule {}

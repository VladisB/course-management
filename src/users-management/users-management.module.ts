import { Module } from "@nestjs/common";
import { UsersController } from "./users-management.controller";
import { IUsersManagementService, UsersManagementService } from "./users-management.service";
import { UsersModule } from "@app/users/users.module";
import { GroupsModule } from "@app/groups/groups.module";
import { RolesModule } from "@app/roles/roles.module";
import { StudentCoursesModule } from "@app/student-courses/student-courses.module";

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

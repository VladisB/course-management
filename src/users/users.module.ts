import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";
import { UsersViewModelFactory } from "./model-factories/users.vm-factory";
import { IUsersRepository, UsersRepository } from "./users.repository";
import { ApplyToQueryExtension } from "../common/query-extention";
import { GroupsModule } from "src/groups/groups.module";
import { UserSubscriber } from "./entities/user.subsriber";
import { StudentCoursesModule } from "src/student-courses/student-courses.module";

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersViewModelFactory,
        {
            provide: IUsersRepository,
            useClass: UsersRepository,
        },
        ApplyToQueryExtension,
        UserSubscriber,
    ],
    imports: [TypeOrmModule.forFeature([User]), RolesModule, GroupsModule, StudentCoursesModule],
    exports: [IUsersRepository],
})
export class UsersModule {}

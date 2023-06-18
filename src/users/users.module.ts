import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { RolesModule } from "../roles/roles.module";
import { IUsersViewModelFactory, UsersViewModelFactory } from "./model-factories/users.vm-factory";
import { IUsersRepository, UsersRepository } from "./users.repository";
import { UserSubscriber } from "./entities/user.subsriber";
import { ApplyToQueryExtension } from "@app/common/query-extention";
import { GroupsModule } from "@app/groups/groups.module";

@Module({
    providers: [
        {
            provide: IUsersRepository,
            useClass: UsersRepository,
        },
        {
            provide: IUsersViewModelFactory,
            useClass: UsersViewModelFactory,
        },
        ApplyToQueryExtension,
        UserSubscriber,
    ],
    imports: [TypeOrmModule.forFeature([User]), RolesModule, GroupsModule],
    exports: [IUsersRepository, IUsersViewModelFactory],
})
export class UsersModule {}

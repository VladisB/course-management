import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";
import { UsersViewModelFactory } from "./model-factories/users.vm-factory";
import { UsersRepository } from "./users.repository";
import { ApplyToQueryExtension } from "../common/query-extention";
import { GroupsModule } from "src/groups/groups.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersViewModelFactory, UsersRepository, ApplyToQueryExtension],
    imports: [TypeOrmModule.forFeature([User]), RolesModule, GroupsModule],
    exports: [UsersService, UsersViewModelFactory, UsersRepository],
})
export class UsersModule {}

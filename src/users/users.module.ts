import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { UsersViewModelFactory } from "./model-factories/user.vm-factory";
import { UsersRepository } from "./users.repository";
import { ApplyToQueryExtension } from "../common/query-extention";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersViewModelFactory, UsersRepository, ApplyToQueryExtension],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), RolesModule],
    exports: [UsersService, UsersViewModelFactory, UsersRepository],
})
export class UsersModule {}

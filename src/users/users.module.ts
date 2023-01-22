import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { UserViewModelFactory } from "./model-factories/user.vm-factory";
import { UsersRepository } from "./users.repository";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserViewModelFactory, UsersRepository],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), RolesModule],
    exports: [UsersService, UserViewModelFactory, UsersRepository],
})
export class UsersModule {}

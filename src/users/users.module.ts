import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), RolesModule],
    exports: [UsersService],
})
export class UsersModule {}

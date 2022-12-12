import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
// import { Role } from "src/roles/role.entity";
import { RolesModule } from "src/roles/roles.module";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
        RolesModule,
        // TypeOrmModule.forFeature([User, Role]),
        // forwardRef(() => RolesModule),
    ],
    exports: [UsersService],
})
export class UsersModule {}

import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
// import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from "./role.entity";
// import { UserRoles } from './user-roles.model';
// import { UsersModule } from "src/users/users.module";
// import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    // SequelizeModule.forFeature([Role, User, UserRoles]),
    // forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}

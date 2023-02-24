import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role } from "./entities/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesRepository } from "./roles.repository";

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Role])],
    providers: [RolesService, RolesRepository],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}

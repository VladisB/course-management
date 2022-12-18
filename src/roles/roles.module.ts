import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role } from "./role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Role])],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}

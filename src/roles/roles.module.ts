import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role } from "./entities/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { RolesRepository } from "./roles.repository";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { RolesViewModelFactory } from "./model-factories/roles.vm-factory";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([Role]),
        ApplyToQueryExtension,
    ],
    providers: [RolesService, RolesRepository, RolesViewModelFactory],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}

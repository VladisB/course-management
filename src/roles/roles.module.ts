import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role } from "./entities/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesRepository } from "./roles.repository";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { RolesViewModelFactory } from "./model-factories/roles.vm-factory";

@Module({
    imports: [TypeOrmModule.forFeature([Role]), ApplyToQueryExtension],
    providers: [RolesService, RolesRepository, RolesViewModelFactory],
    controllers: [RolesController],
    exports: [RolesService, RolesRepository],
})
export class RolesModule {}

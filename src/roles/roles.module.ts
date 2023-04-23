import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplyToQueryExtension } from "src/common/query-extention";
import { Role } from "./entities/role.entity";
import { RolesViewModelFactory } from "./model-factories/roles.vm-factory";
import { RolesController } from "./roles.controller";
import { IRolesRepository, RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";

@Module({
    imports: [TypeOrmModule.forFeature([Role]), ApplyToQueryExtension],
    providers: [
        RolesService,
        { provide: IRolesRepository, useClass: RolesRepository },
        RolesViewModelFactory,
    ],
    controllers: [RolesController],
    exports: [RolesService, IRolesRepository],
})
export class RolesModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplyToQueryExtension } from "@common/query-extention";
import { Role } from "./entities/role.entity";
import { RoleViewModelFactory } from "./model-factories/role.vm-factory";
import { RolesController } from "./roles.controller";
import { IRolesRepository, RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";

@Module({
    imports: [TypeOrmModule.forFeature([Role]), ApplyToQueryExtension],
    providers: [
        RolesService,
        { provide: IRolesRepository, useClass: RolesRepository },
        RoleViewModelFactory,
    ],
    controllers: [RolesController],
    exports: [RolesService, IRolesRepository],
})
export class RolesModule {}

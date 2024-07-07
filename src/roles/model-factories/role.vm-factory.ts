import { Role } from "../entities/role.entity";
import { RoleViewModel } from "../view-models";

export class RoleViewModelFactory implements IRoleViewModelFactory {
    public initRoleViewModel(role: Role): RoleViewModel {
        const model: RoleViewModel = {
            id: null,
            name: "",
        };

        return this.setRoleViewModel(model, role);
    }

    public initRoleListViewModel(roles: Role[]): RoleViewModel[] {
        const model: RoleViewModel[] = [];

        return this.setRoleListViewModel(model, roles);
    }

    private setRoleViewModel(model: RoleViewModel, role: Role): RoleViewModel {
        if (role) {
            model.id = role.id;
            model.name = role.name;
        }

        return model;
    }

    private setRoleListViewModel(model: RoleViewModel[], roles: Role[]): RoleViewModel[] {
        if (roles.length) {
            const roleList = roles.map<RoleViewModel>((Role) => ({
                id: Role.id,
                name: Role.name,
            }));

            model.push(...roleList);
        }

        return model;
    }
}

export interface IRoleViewModelFactory {
    initRoleViewModel(role: Role): RoleViewModel;
    initRoleListViewModel(roles: Role[]): RoleViewModel[];
}

import { Group } from "../entities/group.entity";
import { GroupViewModel } from "../view-models";

export class GroupsViewModelFactory implements IGroupsViewModelFactory {
    public initGroupViewModel(group: Group): GroupViewModel {
        const model: GroupViewModel = {
            id: null,
            groupName: "",
            facultyName: "",
        };

        return this.setGroupViewModel(model, group);
    }

    public initGroupListViewModel(groups: Group[]): GroupViewModel[] {
        const model: GroupViewModel[] = [];

        return this.setFucultyListViewModel(model, groups);
    }

    private setGroupViewModel(model: GroupViewModel, group: Group): GroupViewModel {
        if (group) {
            model.id = group.id;
            model.groupName = group.name;
            model.facultyName = group.faculty.name;
        }

        return model;
    }

    private setFucultyListViewModel(model: GroupViewModel[], groups: Group[]): GroupViewModel[] {
        if (groups.length) {
            const groupList = groups.map<GroupViewModel>((group) => ({
                id: group.id,
                groupName: group.faculty.name,
                facultyName: group.name,
            }));

            model.push(...groupList);
        }

        return model;
    }
}

interface IGroupsViewModelFactory {
    initGroupViewModel(group: Group): GroupViewModel;
    initGroupListViewModel(groups: Group[]): GroupViewModel[];
}

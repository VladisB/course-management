import { CourseViewModel } from "src/courses/view-models";
import { Group } from "../entities/group.entity";
import { GroupViewModel } from "../view-models";

export class GroupsViewModelFactory implements IGroupsViewModelFactory {
    public initGroupViewModel(group: Group): GroupViewModel {
        const model: GroupViewModel = {
            id: null,
            groupName: "",
            facultyName: "",
            courses: [],
        };

        return this.setGroupViewModel(model, group);
    }

    public initGroupListViewModel(groups: Group[]): GroupViewModel[] {
        const model: GroupViewModel[] = [];

        return this.setGroupListViewModel(model, groups);
    }

    private setGroupViewModel(model: GroupViewModel, group: Group): GroupViewModel {
        if (group) {
            model.id = group.id;
            model.groupName = group.name;
            model.facultyName = group.faculty.name;
            model.courses = this.populateCourses(group);
        }

        return model;
    }

    private setGroupListViewModel(model: GroupViewModel[], groups: Group[]): GroupViewModel[] {
        if (groups.length) {
            const groupList = groups.map<GroupViewModel>((group) => ({
                id: group.id,
                groupName: group.name,
                facultyName: group.faculty.name,
                courses: this.populateCourses(group),
            }));

            model.push(...groupList);
        }

        return model;
    }

    private populateCourses(group: Group): CourseViewModel[] {
        if (!group || !group.courses.length) {
            return [];
        }

        const courses = group.courses.map<CourseViewModel>((course) => ({
            id: course.id,
            name: course.name,
        }));

        return courses;
    }
}

interface IGroupsViewModelFactory {
    initGroupViewModel(group: Group): GroupViewModel;
    initGroupListViewModel(groups: Group[]): GroupViewModel[];
}

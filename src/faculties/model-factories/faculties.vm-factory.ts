import { Faculty } from "../entities/faculty.entity";
import { FacultyViewModel } from "../view-models";

export class FacultiesViewModelFactory implements IFacultiesViewModelFactory {
    public initFacultyViewModel(faculty: Faculty): FacultyViewModel {
        const model: FacultyViewModel = {
            id: null,
            name: "",
        };

        return this.setFacultyViewModel(model, faculty);
    }

    public initFacultyListViewModel(faculties: Faculty[]): FacultyViewModel[] {
        const model: FacultyViewModel[] = [];

        return this.setFucultyListViewModel(model, faculties);
    }

    private setFacultyViewModel(model: FacultyViewModel, fuculty: Faculty): FacultyViewModel {
        if (fuculty) {
            model.id = fuculty.id;
            model.name = fuculty.name;
        }

        return model;
    }

    private setFucultyListViewModel(
        model: FacultyViewModel[],
        faculties: Faculty[],
    ): FacultyViewModel[] {
        if (faculties.length) {
            const facultyList = faculties.map<FacultyViewModel>((fuculty) => ({
                id: fuculty.id,
                name: fuculty.name,
            }));

            model.push(...facultyList);
        }

        return model;
    }
}

interface IFacultiesViewModelFactory {
    initFacultyViewModel(faculty: Faculty): FacultyViewModel;
    initFacultyListViewModel(faculty: Faculty[]): FacultyViewModel[];
}

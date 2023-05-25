import { Homework } from "../entities/homework.entity";
import { HomeworkViewModel } from "../view-models";

export class HomeworkViewModelFactory implements IHomeworkViewModelFactory {
    public initHomeworkViewModel(homework: Homework): HomeworkViewModel {
        const model: HomeworkViewModel = {
            id: 0,
            studentId: 0,
            studentName: "",
            studentLastName: "",
            filePath: "",
            createdBy: "",
            modifiedBy: "",
            createdAt: null,
            modifiedAt: null,
        };

        return this.setHomeworkViewModel(model, homework);
    }

    public initHomeworkListViewModel(homeworks: Homework[]): HomeworkViewModel[] {
        const model: HomeworkViewModel[] = [];

        return this.setHomeworkListViewModel(model, homeworks);
    }

    private setHomeworkViewModel(model: HomeworkViewModel, homework: Homework): HomeworkViewModel {
        if (homework) {
            model.id = homework.id;
            model.studentId = homework.student.id;
            model.studentName = homework.student.firstName;
            model.studentLastName = homework.student.lastName;
            model.filePath = homework.filePath;
            model.createdBy = homework.createdBy.email;
            model.modifiedBy = homework.modifiedBy.email;
            model.createdAt = homework.createdAt;
            model.modifiedAt = homework.modifiedAt;
        }

        return model;
    }

    private setHomeworkListViewModel(
        model: HomeworkViewModel[],
        homeworks: Homework[],
    ): HomeworkViewModel[] {
        if (homeworks.length) {
            const homeworkList: HomeworkViewModel[] = homeworks.map((homework) => ({
                id: homework.id,
                studentId: homework.student.id,
                studentName: homework.student.firstName,
                studentLastName: homework.student.lastName,
                filePath: homework.filePath,
                createdBy: homework.createdBy.email,
                modifiedBy: homework.modifiedBy.email,
                createdAt: homework.createdAt,
                modifiedAt: homework.modifiedAt,
            }));

            model.push(...homeworkList);
        }

        return model;
    }
}

interface IHomeworkViewModelFactory {
    initHomeworkViewModel(homework: Homework): HomeworkViewModel;
    initHomeworkListViewModel(homeworks: Homework[]): HomeworkViewModel[];
}

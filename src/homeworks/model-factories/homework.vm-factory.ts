import { Homework } from "../entities/homework.entity";
import { SignedHomeworkURL } from "../interfaces/signed-homework-url.interface";
import { HomeworkViewModel } from "../view-models";

export class HomeworkViewModelFactory implements IHomeworkViewModelFactory {
    public initHomeworkViewModel(homework: Homework, downloadURL: string): HomeworkViewModel {
        const model: HomeworkViewModel = {
            id: 0,
            studentId: 0,
            studentName: "",
            studentLastName: "",
            downloadURL: null,
            createdBy: "",
            modifiedBy: "",
            createdAt: null,
            modifiedAt: null,
        };

        return this.setHomeworkViewModel(model, homework, downloadURL);
    }

    public initHomeworkListViewModel(
        homeworks: Homework[],
        signedURLList: SignedHomeworkURL[],
    ): HomeworkViewModel[] {
        const model: HomeworkViewModel[] = [];

        return this.setHomeworkListViewModel(model, homeworks, signedURLList);
    }

    private setHomeworkViewModel(
        model: HomeworkViewModel,
        homework: Homework,
        downloadURL: string,
    ): HomeworkViewModel {
        if (homework) {
            model.id = homework.id;
            model.studentId = homework.student.id;
            model.studentName = homework.student.firstName;
            model.studentLastName = homework.student.lastName;
            model.downloadURL = downloadURL;
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
        signedURLList: SignedHomeworkURL[],
    ): HomeworkViewModel[] {
        if (homeworks.length) {
            const homeworkList: HomeworkViewModel[] = homeworks.map((homework) => {
                const signedURL = signedURLList.find((url) => url.homeworkId === homework.id);

                return {
                    id: homework.id,
                    studentId: homework.student.id,
                    studentName: homework.student.firstName,
                    studentLastName: homework.student.lastName,
                    downloadURL: signedURL.url ?? null,
                    createdBy: homework.createdBy.email,
                    modifiedBy: homework.modifiedBy.email,
                    createdAt: homework.createdAt,
                    modifiedAt: homework.modifiedAt,
                };
            });

            model.push(...homeworkList);
        }

        return model;
    }
}

interface IHomeworkViewModelFactory {
    initHomeworkViewModel(homework: Homework, downloadURL: string): HomeworkViewModel;
    initHomeworkListViewModel(
        homeworks: Homework[],
        signedURLList: SignedHomeworkURL[],
    ): HomeworkViewModel[];
}

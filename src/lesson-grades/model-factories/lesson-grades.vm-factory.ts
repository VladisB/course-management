import { LessonGrades } from "../entities/lesson-grade.entity";
import { LessonGradeViewModel } from "../view-models";

export class LessonGradesViewModelFactory implements ILessonGradesViewModelFactory {
    public initLessonGradesViewModel(lessonGrades: LessonGrades): LessonGradeViewModel {
        const model: LessonGradeViewModel = {
            id: 0,
            studentId: 0,
            studentName: "",
            studentLastName: "",
            grade: 0,
            createdBy: "",
            modifiedBy: "",
            createdAt: null,
        };

        return this.setLessonViewModel(model, lessonGrades);
    }

    public initLessonGradeListViewModel(lessons: LessonGrades[]): LessonGradeViewModel[] {
        const model: LessonGradeViewModel[] = [];

        return this.setLessonGradeViewModel(model, lessons);
    }

    private setLessonViewModel(
        model: LessonGradeViewModel,
        lessonGrades: LessonGrades,
    ): LessonGradeViewModel {
        if (lessonGrades) {
            model.id = lessonGrades.id;
            model.studentId = lessonGrades.student.id;
            model.studentName = lessonGrades.student.firstName;
            model.studentLastName = lessonGrades.student.lastName;
            model.grade = lessonGrades.grade;
            model.createdBy = lessonGrades.createdBy.email;
            model.modifiedBy = lessonGrades.modifiedBy.email;
            model.createdAt = lessonGrades.createdAt;
        }

        return model;
    }

    private setLessonGradeViewModel(
        model: LessonGradeViewModel[],
        lessonGrades: LessonGrades[],
    ): LessonGradeViewModel[] {
        if (lessonGrades.length) {
            const lessonList: LessonGradeViewModel[] = lessonGrades.map((lessonGrade) => ({
                id: lessonGrade.id,
                studentId: lessonGrade.student.id,
                studentName: lessonGrade.student.firstName,
                studentLastName: lessonGrade.student.lastName,
                grade: lessonGrade.grade,
                createdBy: lessonGrade.createdBy.email,
                modifiedBy: lessonGrade.modifiedBy.email,
                createdAt: lessonGrade.createdAt,
            }));

            model.push(...lessonList);
        }

        return model;
    }
}

interface ILessonGradesViewModelFactory {
    initLessonGradesViewModel(lessonGrades: LessonGrades): LessonGradeViewModel;
    initLessonGradeListViewModel(lessons: LessonGrades[]): LessonGradeViewModel[];
}

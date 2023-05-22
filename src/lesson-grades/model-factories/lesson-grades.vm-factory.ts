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
            createdAt: null,
        };

        return this.setLessonViewModel(model, lessonGrades);
    }

    // public initLessonListViewModel(lessons: Lesson[]): LessonViewModel[] {
    //     const model: LessonViewModel[] = [];

    //     return this.setLessonListViewModel(model, lessons);
    // }

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
            model.createdAt = lessonGrades.createdAt;
        }

        return model;
    }

    // private setLessonListViewModel(model: LessonViewModel[], lessons: Lesson[]): LessonViewModel[] {
    //     if (lessons.length) {
    //         const lessonList = lessons.map<LessonViewModel>((lesson) => ({
    //             id: lesson.id,
    //             theme: lesson.theme,
    //             date: lesson.date,
    //             courseId: lesson.course.id,
    //             course: lesson.course.name,
    //             instructorList: this.populateInstructorList(lesson),
    //         }));

    //         model.push(...lessonList);
    //     }

    //     return model;
    // }
}

interface ILessonGradesViewModelFactory {
    initLessonGradesViewModel(lessonGrades: LessonGrades): LessonGradeViewModel;
    // initLessonListViewModel(lesson: Lesson[]): LessonViewModel[];
}

import { Lesson } from "../entities/lesson.entity";
import { LessonViewModel } from "../view-models";

export class LessonsViewModelFactory implements ILessonsViewModelFactory {
    public initLessonViewModel(lesson: Lesson): LessonViewModel {
        const model: LessonViewModel = {
            id: null,
            theme: "",
            date: null,
            course: "",
        };

        return this.setLessonViewModel(model, lesson);
    }

    public initLessonListViewModel(lessons: Lesson[]): LessonViewModel[] {
        const model: LessonViewModel[] = [];

        return this.setLessonListViewModel(model, lessons);
    }

    private setLessonViewModel(model: LessonViewModel, lesson: Lesson): LessonViewModel {
        if (lesson) {
            model.id = lesson.id;
            model.theme = lesson.theme;
            model.date = lesson.date;
            model.course = lesson.course.name;
        }

        return model;
    }

    private setLessonListViewModel(model: LessonViewModel[], lessons: Lesson[]): LessonViewModel[] {
        if (lessons.length) {
            const lessonList = lessons.map<LessonViewModel>((group) => ({
                id: group.id,
                theme: group.theme,
                date: group.date,
                course: group.course.name,
            }));

            model.push(...lessonList);
        }

        return model;
    }
}

interface ILessonsViewModelFactory {
    initLessonViewModel(lesson: Lesson): LessonViewModel;
    initLessonListViewModel(lesson: Lesson[]): LessonViewModel[];
}

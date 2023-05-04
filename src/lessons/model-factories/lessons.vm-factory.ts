import { Lesson } from "../entities/lesson.entity";
import { LessonInstructorViewModel, LessonViewModel } from "../view-models";

export class LessonsViewModelFactory implements ILessonsViewModelFactory {
    public initLessonViewModel(lesson: Lesson): LessonViewModel {
        const model: LessonViewModel = {
            id: 0,
            theme: "",
            date: null,
            course: "",
            instructorList: [],
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
            model.instructorList = this.populateInstructorList(lesson);
        }

        return model;
    }

    private setLessonListViewModel(model: LessonViewModel[], lessons: Lesson[]): LessonViewModel[] {
        if (lessons.length) {
            const lessonList = lessons.map<LessonViewModel>((lesson) => ({
                id: lesson.id,
                theme: lesson.theme,
                date: lesson.date,
                course: lesson.course.name,
                instructorList: this.populateInstructorList(lesson),
            }));

            model.push(...lessonList);
        }

        return model;
    }

    private populateInstructorList(lesson: Lesson): LessonInstructorViewModel[] {
        if (!lesson.course.courseInstructors) return [];

        const instructorList = lesson.course.courseInstructors.map((ci) => ({
            id: ci.instructor.id,
            firstName: ci.instructor.firstName,
            lastName: ci.instructor.lastName,
        }));

        return instructorList;
    }
}

interface ILessonsViewModelFactory {
    initLessonViewModel(lesson: Lesson): LessonViewModel;
    initLessonListViewModel(lesson: Lesson[]): LessonViewModel[];
}

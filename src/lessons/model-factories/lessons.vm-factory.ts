import { Lesson } from "../entities/lesson.entity";
import {
    LessonInstructorViewModel,
    LessonViewModel,
    StudentLessonListViewModel,
} from "../view-models";

export class LessonViewModelFactory implements ILessonViewModelFactory {
    public initLessonViewModel(lesson: Lesson): LessonViewModel {
        const model: LessonViewModel = {
            id: 0,
            courseId: 0,
            course: "",
            theme: "",
            date: null,
            instructorList: [],
        };

        return this.setLessonViewModel(model, lesson);
    }

    public initLessonListViewModel(lessons: Lesson[]): LessonViewModel[] {
        const model: LessonViewModel[] = [];

        return this.setLessonListViewModel(model, lessons);
    }

    public initStudentLessonListViewModel(lessons: Lesson[]): StudentLessonListViewModel[] {
        const model: StudentLessonListViewModel[] = [];

        return this.setStudentLessonListViewModel(model, lessons);
    }

    private setLessonViewModel(model: LessonViewModel, lesson: Lesson): LessonViewModel {
        if (lesson) {
            model.id = lesson.id;
            model.courseId = lesson.course.id;
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
                courseId: lesson.course.id,
                course: lesson.course.name,
                instructorList: this.populateInstructorList(lesson),
            }));

            model.push(...lessonList);
        }

        return model;
    }

    private setStudentLessonListViewModel(
        model: StudentLessonListViewModel[],
        lessons: Lesson[],
    ): StudentLessonListViewModel[] {
        if (lessons.length) {
            const lessonList = lessons.map<StudentLessonListViewModel>((lesson) => ({
                id: lesson.id,
                theme: lesson.theme,
                date: lesson.date,
                courseId: lesson.course.id,
                course: lesson.course.name,
                grade:
                    Array.isArray(lesson?.grades) && lesson.grades.length > 0
                        ? lesson.grades[0].grade
                        : null,
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

interface ILessonViewModelFactory {
    initLessonViewModel(lesson: Lesson): LessonViewModel;
    initLessonListViewModel(lesson: Lesson[], showGrades: boolean): LessonViewModel[];
    initStudentLessonListViewModel(lessons: Lesson[]): StudentLessonListViewModel[];
}

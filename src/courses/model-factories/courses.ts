import { Course } from "../entities/course.entity";
import { CourseViewModel } from "../view-models";

export class CoursesViewModelFactory implements ICoursesViewModelFactory {
    public initCourseViewModel(course: Course): CourseViewModel {
        const model: CourseViewModel = {
            id: null,
            name: "",
        };

        return this.setCourseViewModel(model, course);
    }

    public initCourseListViewModel(courses: Course[]): CourseViewModel[] {
        const model: CourseViewModel[] = [];

        return this.setCourseListViewModel(model, courses);
    }

    private setCourseViewModel(model: CourseViewModel, course: Course): CourseViewModel {
        if (course) {
            model.id = course.id;
            model.name = course.name;
        }

        return model;
    }

    private setCourseListViewModel(model: CourseViewModel[], courses: Course[]): CourseViewModel[] {
        if (courses.length) {
            const courseList = courses.map<CourseViewModel>((course) => ({
                id: course.id,
                name: course.name,
            }));

            model.push(...courseList);
        }

        return model;
    }
}

interface ICoursesViewModelFactory {
    initCourseViewModel(course: Course): CourseViewModel;
    initCourseListViewModel(courses: Course[]): CourseViewModel[];
}

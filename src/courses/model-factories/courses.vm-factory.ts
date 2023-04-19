import { Course } from "../entities/course.entity";
import { CourseViewModel } from "../view-models";

export class CoursesViewModelFactory implements ICoursesViewModelFactory {
    public initCourseViewModel(course: Course): CourseViewModel {
        const model: CourseViewModel = {
            id: null,
            name: "",
            instructor: "",
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
            model.instructor = course?.instructor
                ? course.instructor.firstName + " " + course.instructor.lastName
                : null;
        }

        return model;
    }

    private setCourseListViewModel(model: CourseViewModel[], courses: Course[]): CourseViewModel[] {
        if (courses.length) {
            const courseList = courses.map<CourseViewModel>((course) => ({
                id: course.id,
                name: course.name,
                instructor: course?.instructor
                    ? course.instructor.firstName + " " + course.instructor.lastName
                    : null,
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

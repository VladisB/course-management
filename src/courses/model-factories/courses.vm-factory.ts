import { Course } from "../entities/course.entity";
import { CourseInstructorListItemViewModel, CourseViewModel } from "../view-models";

export class CoursesViewModelFactory implements ICoursesViewModelFactory {
    public initCourseViewModel(course: Course): CourseViewModel {
        const model: CourseViewModel = {
            id: 0,
            name: "",
            instructorList: [],
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
            model.instructorList = this.populateInstructorList(course);
        }

        return model;
    }

    private populateInstructorList(course: Course): CourseInstructorListItemViewModel[] {
        const instructorList = course.courseInstructors.map<CourseInstructorListItemViewModel>(
            (courseInstructor) => ({
                instructorId: courseInstructor.instructor.id,
                firstName: courseInstructor.instructor.firstName,
                lastName: courseInstructor.instructor.lastName,
            }),
        );

        return instructorList;
    }

    private setCourseListViewModel(model: CourseViewModel[], courses: Course[]): CourseViewModel[] {
        if (courses.length) {
            const courseList = courses.map<CourseViewModel>((course) => ({
                id: course.id,
                name: course.name,
                instructorList: this.populateInstructorList(course),
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

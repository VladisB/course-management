import { CourseInstructors } from "../entities/course-instructors.entity";
import { CourseInstructorsViewModel, InstructorListItemViewModel } from "../view-models";

export class CourseInstructorsViewModelFactory implements ICoursesViewModelFactory {
    public initCourseInstructorsListViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel[] {
        const model: CourseInstructorsViewModel[] = [];

        return this.setCourseListViewModel(model, courseInstructors);
    }

    public initCourseInstructorsViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel {
        const model: CourseInstructorsViewModel = {
            id: 0,
            courseId: null,
            courseName: "",
            instructors: [],
        };

        return this.setCourseViewModel(model, courseInstructors);
    }

    private setCourseViewModel(
        model: CourseInstructorsViewModel,
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel {
        if (courseInstructors) {
            const firstItem = courseInstructors.find((courseInstructors) => courseInstructors.id);

            model.id = firstItem.id;
            model.courseName = firstItem.course.name;
            model.courseId = firstItem.course.id;
            model.instructors = this.populateInstructors(courseInstructors);
        }

        return model;
    }

    private setCourseListViewModel(
        model: CourseInstructorsViewModel[],
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel[] {
        if (courseInstructors.length) {
            const courseList = courseInstructors.map<CourseInstructorsViewModel>((item) => ({
                id: item.id,
                courseId: item.course.id,
                courseName: item.course.name,
                instructors: this.populateInstructors(courseInstructors),
            }));

            model.push(...courseList);
        }

        return model;
    }

    private populateInstructors(
        courseInstructors: CourseInstructors[],
    ): InstructorListItemViewModel[] {
        if (!courseInstructors || !courseInstructors.length) {
            return [];
        }

        const instructors = courseInstructors.map((courseInstructors) => {
            const instructor = courseInstructors.instructor;

            return {
                instructorId: instructor.id,
                instructorName: instructor.firstName,
                instructorLastName: instructor.lastName,
            };
        });

        return instructors;
    }
}

interface ICoursesViewModelFactory {
    initCourseInstructorsViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel;
    initCourseInstructorsListViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel[];
}

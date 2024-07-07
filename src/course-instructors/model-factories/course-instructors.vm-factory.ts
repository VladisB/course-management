import { CourseInstructors } from "../entities/course-instructors.entity";
import {
    CourseInstructorViewModel,
    CourseInstructorsViewModel,
    CourseInstructorsListViewModel,
    InstructorListItemViewModel,
} from "../view-models";

export class CourseInstructorsViewModelFactory implements ICoursesViewModelFactory {
    public initCourseInstructorsListViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsListViewModel[] {
        const model: CourseInstructorsListViewModel[] = [];

        return this.setCourseInstructorsListViewModel(model, courseInstructors);
    }

    public initCourseInstructorsViewModel(
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel {
        const model: CourseInstructorsViewModel = {
            courseId: 0,
            courseName: "",
            instructors: [],
        };

        return this.setCourseInstructorsViewModel(model, courseInstructors);
    }

    public initCourseInstructorViewModel(
        courseInstructor: CourseInstructors,
    ): CourseInstructorViewModel {
        const model: CourseInstructorViewModel = {
            id: 0,
            courseId: 0,
            courseName: "",
            instructorId: null,
            instructorLastName: "",
            instructorName: "",
        };

        return this.setCourseInstructorViewModel(model, courseInstructor);
    }

    private setCourseInstructorViewModel(
        model: CourseInstructorViewModel,
        courseInstructor: CourseInstructors,
    ): CourseInstructorViewModel {
        if (courseInstructor) {
            model.id = courseInstructor.id;
            model.courseName = courseInstructor.course.name;
            model.courseId = courseInstructor.course.id;
            model.instructorId = courseInstructor.instructor.id;
            model.instructorName = courseInstructor.instructor.firstName;
            model.instructorLastName = courseInstructor.instructor.lastName;
        }

        return model;
    }

    private setCourseInstructorsViewModel(
        model: CourseInstructorsViewModel,
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsViewModel {
        if (courseInstructors && courseInstructors.length) {
            const firstItem = courseInstructors.find((courseInstructors) => courseInstructors.id);

            model.courseName = firstItem.course.name;
            model.courseId = firstItem.course.id;
            model.instructors = this.populateInstructors(courseInstructors);
        }

        return model;
    }

    private setCourseInstructorsListViewModel(
        model: CourseInstructorsListViewModel[],
        courseInstructors: CourseInstructors[],
    ): CourseInstructorsListViewModel[] {
        if (courseInstructors.length) {
            const modelList = courseInstructors.map((item) => ({
                courseId: item.course.id,
                courseInstructorId: item.id,
                courseName: item.course.name,
                instructorId: item.instructor.id,
                instructorLastName: item.instructor.lastName,
                instructorName: item.instructor.firstName,
            }));

            model.push(...modelList);
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
                courseInstructorId: courseInstructors.id,
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
    ): CourseInstructorsListViewModel[];
    initCourseInstructorViewModel(courseInstructor: CourseInstructors): CourseInstructorViewModel;
}

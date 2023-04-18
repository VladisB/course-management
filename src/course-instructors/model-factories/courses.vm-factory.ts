import { CourseInstructors } from "../entities/course-instructors.entity";
import { CourseInstructorsViewModel, InstructorListItemViewModel } from "../view-models";

export class CourseInstructorsViewModelFactory implements ICoursesViewModelFactory {
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
}

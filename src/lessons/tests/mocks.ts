import { Course } from "@app/courses/entities/course.entity";
import { Lesson } from "../entities/lesson.entity";

const mockLessonsRepository = () => ({
    create: jest.fn().mockImplementation((entity: Lesson) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getAllQByStudent: jest.fn().mockReturnValue(null),
    getAllQByInstructor: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Lesson) => {
        return Promise.resolve(entity);
    }),
});

const mockCoursesRepository = () => ({
    create: jest.fn().mockImplementation((entity: Lesson) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Course) => {
        return Promise.resolve(entity);
    }),
});

export { mockLessonsRepository, mockCoursesRepository };

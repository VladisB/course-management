import { Course } from "@app/courses/entities/course.entity";
import { Lesson } from "../entities/lesson.entity";

const mockLessonsRepository = () => ({
    create: jest.fn().mockImplementation((entity: Lesson) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    trxCreate: jest.fn().mockResolvedValue(null),
    trxGetAllByCourseId: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getAllQByStudent: jest.fn().mockReturnValue(null),
    getAllQByInstructor: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Lesson) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn(),
    initTrx: jest.fn().mockResolvedValue(null),
    rollbackTrx: jest.fn().mockResolvedValue(null),
    commitTrx: jest.fn().mockResolvedValue(null),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

const mockCoursesRepository = () => ({
    create: jest.fn().mockImplementation((entity: Course) => {
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
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

export { mockLessonsRepository, mockCoursesRepository };

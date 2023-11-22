import { Lesson } from "@app/lessons/entities/lesson.entity";
import { LessonGrades } from "../entities/lesson-grade.entity";
import { User } from "@app/users/entities/user.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";

const mockLessonGradesRepository = () => ({
    create: jest.fn().mockImplementation((entity: LessonGrades) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getByLesson: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: LessonGrades) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    createQueryBuilder: jest.fn(),
    trxCreate: jest.fn(),
    trxGetAllByCourse: jest.fn(),
    trxDeleteById: jest.fn(),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
    initTrx: jest.fn(),
    rollbackTrx: jest.fn(),
    trxUpdate: jest.fn(),
    commitTrx: jest.fn(),
});

const mockLessonsRepository = () => ({
    create: jest.fn().mockImplementation((entity: Lesson) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Lesson) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn(),
    trxGetAllByCourseId: jest.fn(),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

const mockUsersRepository = () => ({
    create: jest.fn().mockImplementation((entity: User) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getStudentById: jest.fn().mockResolvedValue(null),
    getByEmail: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: User) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    getStudentCoursesByStudentId: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    getByIdList: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn(),
    trxUpdate: jest.fn(),
    trxCreate: jest.fn(),
    getAllStudentsQ: jest.fn(),
    updateRefreshToken: jest.fn(),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
    initTrx: jest.fn(),
    rollbackTrx: jest.fn(),
    commitTrx: jest.fn(),
});

const mockStudentCoursesRepository = () => ({
    create: jest.fn().mockImplementation((entity: StudentCourses) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getAllQByStudent: jest.fn().mockReturnValue(null),
    getAllQByInstructor: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: StudentCourses) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    trxGetByCourseAndStudent: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn(),
    trxUpdate: jest.fn(),
    trxBulkCreate: jest.fn(),
    trxBulkDelete: jest.fn(),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

export {
    mockLessonGradesRepository,
    mockLessonsRepository,
    mockUsersRepository,
    mockStudentCoursesRepository,
};

import { StudentCourses } from "../entities/student-courses.entity";

const mockStudentCoursesRepository = () => ({
    create: jest.fn().mockImplementation((entity: StudentCourses) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    getByCourseAndStudent: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    trxGetByIdList: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: StudentCourses) => {
        return Promise.resolve(entity);
    }),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue([]),
    createQueryBuilder: jest.fn(),
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

export { mockStudentCoursesRepository };

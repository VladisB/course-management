import { Course } from "../entities/course.entity";

const mockCoursesRepository = () => ({
    create: jest.fn().mockImplementation((entity: Course) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    update: jest.fn().mockImplementation((entity: Course) => {
        return Promise.resolve(entity);
    }),
    createQueryBuilder: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(null),
    find: jest.fn().mockResolvedValue(null),
    getByName: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockResolvedValue(null),
    getById: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    isAssignedToGroup: jest.fn().mockResolvedValue(null),
    getAllByStudentId: jest.fn().mockResolvedValue(null),
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

export { mockCoursesRepository };

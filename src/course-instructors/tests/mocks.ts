import { CourseInstructors } from "../entities/course-instructors.entity";

const mockCourseInstructorsRepository = () => ({
    create: jest.fn().mockImplementation((entity: CourseInstructors) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    bulkCreate: jest.fn().mockResolvedValue([]),
    getByDetails: jest.fn().mockReturnValue([]),
    getById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: CourseInstructors) => {
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
    getByIdWithFullDetails: jest.fn(),
    trxGetAllByCourseId: jest.fn(),
    trxBulkCreate: jest.fn(),
    trxDeleteByIdList: jest.fn(),
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

export { mockCourseInstructorsRepository };

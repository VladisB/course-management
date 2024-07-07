import { Homework } from "../entities/homework.entity";

const mockHomeworksRepository = () => ({
    create: jest.fn().mockImplementation((entity: Homework) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Homework) => {
        return Promise.resolve(entity);
    }),
    delete: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    createQueryBuilder: jest.fn(),
    getByLesson: jest.fn().mockResolvedValue(null),
    getAllByStudentQ: jest.fn().mockResolvedValue(null),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

export { mockHomeworksRepository };

import { Faculty } from "../entities/faculty.entity";

const mockFacultiesRepository = () => ({
    create: jest.fn().mockImplementation((entity: Faculty) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getAllQByStudent: jest.fn().mockReturnValue(null),
    getAllQByInstructor: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByName: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Faculty) => {
        return Promise.resolve(entity);
    }),
});

export { mockFacultiesRepository };

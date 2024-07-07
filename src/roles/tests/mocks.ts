import { Role } from "../entities/role.entity";

const mockRolesRepository = () => ({
    getByName: jest.fn().mockResolvedValue(null),
    getById: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn().mockImplementation((entity: Role) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    update: jest.fn().mockImplementation((entity: Role) => {
        return Promise.resolve(entity);
    }),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

export { mockRolesRepository };

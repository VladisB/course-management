import { CreateRoleDto } from "../dto/create-role.dto";
import { Role } from "../role.entity";

const rolesMock = [
    {
        id: 2,
        name: "admin",
    },
    {
        id: 3,
        name: "student",
    },
];

const mockRolesRepository = () => ({
    getAllUsers: jest.fn(),
    findOne: jest.fn().mockResolvedValue(rolesMock[0]),
    findOneBy: jest.fn().mockResolvedValue(rolesMock[0]),
    find: jest.fn().mockResolvedValue(rolesMock),
    create: jest.fn((dto: CreateRoleDto) => {
        const role = new Role();
        role.name = dto.name;

        return role;
    }),
    save: jest.fn().mockImplementation((role: Role): Promise<Role> => {
        role.id = 1;
        return Promise.resolve(role);
    }),
});

export { rolesMock, mockRolesRepository };

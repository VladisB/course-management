import { Course } from "@app/courses/entities/course.entity";
import { GroupCourses } from "../entities/group-courses.entity";
import { Group } from "../entities/group.entity";
import { Faculty } from "@app/faculties/entities/faculty.entity";

const mockGroupsRepository = () => ({
    getByName: jest.fn().mockResolvedValue(null),
    getById: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    getStudentNumberByGroupId: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((entity: Group) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    update: jest.fn().mockImplementation((entity: Group) => {
        return Promise.resolve(entity);
    }),
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

const mockGroupCoursesRepository = () => ({
    getByName: jest.fn().mockResolvedValue(null),
    getById: jest.fn().mockResolvedValue(null),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getStudentNumberByGroupId: jest.fn().mockResolvedValue(null),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn().mockImplementation((entity: GroupCourses) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    update: jest.fn().mockImplementation((entity: GroupCourses) => {
        return Promise.resolve(entity);
    }),
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
    getByIdList: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Course) => {
        return Promise.resolve(entity);
    }),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

const mockFacultiesRepository = () => ({
    create: jest.fn().mockImplementation((entity: Faculty) => {
        entity.id = 1;
        return Promise.resolve(entity);
    }),
    deleteById: jest.fn().mockResolvedValue(null),
    getAllQ: jest.fn().mockReturnValue(null),
    getById: jest.fn().mockResolvedValue(null),
    getByTheme: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((entity: Faculty) => {
        return Promise.resolve(entity);
    }),
    manager: {
        connection: {
            createQueryRunner: jest.fn(),
        },
    },
});

export {
    mockGroupsRepository,
    mockGroupCoursesRepository,
    mockCoursesRepository,
    mockFacultiesRepository,
};

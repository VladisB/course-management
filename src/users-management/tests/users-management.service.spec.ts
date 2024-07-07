import { Test, TestingModule } from "@nestjs/testing";
import { IUsersRepository } from "@app/users/users.repository";
import { IGroupsRepository } from "@app/groups/groups.repository";
import { IRolesRepository } from "@app/roles/roles.repository";
import { CreateUserDto } from "@app/users/dto/create-user.dto";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { IStudentCoursesRepository } from "@app/student-courses/student-courses.repository";
import { IUsersViewModelFactory } from "@app/users/model-factories";
import { SelectQueryBuilder } from "typeorm";
import { mockStudentCoursesRepository, mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { User } from "@app/users/entities/user.entity";
import { UsersManagementService } from "../users-management.service";
import {
    groupCoursesStub,
    groupStub,
    instructorRoleStub,
    instructorUserStub,
    instructorUserVMStub,
    studentCoursesMockList,
    studentRoleStub,
    studentUserStub,
    studentUserVMStub,
    userMockList,
    userVMMList,
} from "@app/common/test/stubs";
import { mockRolesRepository } from "@app/roles/tests/mocks";
import { BaseErrorMessage } from "@app/common/enum";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { UserViewModel } from "@app/users/view-models";
import { ApplyToQueryExtension } from "@app/common/query-extention";
import { UpdateUserDto } from "@app/users/dto/update-user.dto";

const queryBuilderMock = mockQueryBuilder<UserViewModel>(userMockList);

describe("UsersManagementService", () => {
    let usersManagementService: UsersManagementService;

    let rolesRepository: IRolesRepository;
    let studentCoursesRepository: IStudentCoursesRepository;
    let usersRepository: IUsersRepository;
    let groupsRepository: IGroupsRepository;
    let usersViewModelFactory: IUsersViewModelFactory;

    let user: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersManagementService,
                {
                    provide: IRolesRepository,
                    useValue: mockRolesRepository(),
                },
                {
                    provide: IStudentCoursesRepository,
                    useValue: mockStudentCoursesRepository(),
                },
                {
                    provide: IUsersRepository,
                    useValue: mockUsersRepository(),
                },
                {
                    provide: IGroupsRepository,
                    useValue: {
                        getById: jest.fn(),
                    },
                },
                {
                    provide: IUsersViewModelFactory,
                    useValue: {
                        initUserViewModel: jest.fn(),
                        initUserListViewModel: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersManagementService = module.get<UsersManagementService>(UsersManagementService);
        rolesRepository = module.get<IRolesRepository>(IRolesRepository);
        studentCoursesRepository = module.get<IStudentCoursesRepository>(IStudentCoursesRepository);
        usersRepository = module.get<IUsersRepository>(IUsersRepository);
        groupsRepository = module.get<IGroupsRepository>(IGroupsRepository);
        usersViewModelFactory = module.get<IUsersViewModelFactory>(IUsersViewModelFactory);
    });

    it("should be defined usersManagementService", () => {
        expect(usersManagementService).toBeDefined();
    });

    it("should be defined rolesRepository", () => {
        expect(rolesRepository).toBeDefined();
    });

    it("should be defined studentCoursesRepository", () => {
        expect(studentCoursesRepository).toBeDefined();
    });

    it("should be defined usersRepository", () => {
        expect(usersRepository).toBeDefined();
    });

    it("should be defined groupsRepository", () => {
        expect(groupsRepository).toBeDefined();
    });

    it("should be defined usersViewModelFactory", () => {
        expect(usersViewModelFactory).toBeDefined();
    });

    describe("createUser", () => {
        it("should successfully create a user and assign group", async () => {
            const dto: CreateUserDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
                groupId: groupStub.id,
            };

            groupStub.groupCourses = [groupCoursesStub];

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(studentRoleStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupStub);
            jest.spyOn(usersRepository, "trxCreate").mockResolvedValue(studentUserStub);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                studentUserVMStub,
            );

            const result = await usersManagementService.createUser(dto, user);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.email).toEqual(expect.any(String));
            expect(result.firstName).toEqual(expect.any(String));
            expect(result.lastName).toEqual(expect.any(String));
            expect(result.role).toEqual(expect.any(String));
            expect(result.group).toEqual(expect.any(String || null));
        });

        it("should rollback transaction and throw error if an error occurs", async () => {
            const dto: CreateUserDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);
            jest.spyOn(usersRepository, "create").mockImplementation(async () => {
                throw new Error("Test error");
            });
            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                const result = await usersManagementService.createUser(dto, user);

                expect(result).toBeUndefined();
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(usersRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });

        it("should successfully create instructor user", async () => {
            const dto: CreateUserDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
                roleId: instructorRoleStub.id,
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);
            jest.spyOn(rolesRepository, "getById").mockResolvedValue(instructorRoleStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(null);
            jest.spyOn(usersRepository, "create").mockResolvedValue(instructorUserStub);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                instructorUserVMStub,
            );

            const result = await usersManagementService.createUser(dto, user);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.email).toEqual(expect.any(String));
            expect(result.firstName).toEqual(expect.any(String));
            expect(result.lastName).toEqual(expect.any(String));
            expect(result.role).toEqual(expect.any(String));
            expect(result.group).toEqual(null);
        });

        it("should throw a ConflictException when email already exists", async () => {
            const dto: CreateUserDto = {
                email: studentUserStub.email,
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);

            await expect(usersManagementService.createUser(dto, user)).rejects.toThrowError(
                new ConflictException(`Email is already taken`),
            );
        });
    });

    describe("signUp", () => {
        it("should successfully create a user", async () => {
            const dto: CreateUserDto = {
                email: "test@gmail.com",
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(null);
            jest.spyOn(rolesRepository, "getByName").mockResolvedValue(studentRoleStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(null);
            jest.spyOn(usersRepository, "trxCreate").mockResolvedValue(studentUserStub);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                studentUserVMStub,
            );

            const result = await usersManagementService.signUpStudent(dto, user);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.email).toEqual(expect.any(String));
            expect(result.firstName).toEqual(expect.any(String));
            expect(result.lastName).toEqual(expect.any(String));
            expect(result.role?.name).toEqual(expect.any(String));
            expect(result.group).toEqual(null);
        });

        it("should throw a ConflictException when email already exists", async () => {
            const dto: CreateUserDto = {
                email: studentUserStub.email,
                firstName: "Test first name",
                lastName: "Test last name",
                password: "Test password",
            };

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);

            await expect(usersManagementService.signUpStudent(dto, user)).rejects.toThrowError(
                new ConflictException(`Email is already taken`),
            );
        });
    });

    // describe("delete user by id", () => {
    //     it("should delete user", async () => {
    //         jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);

    //         const id = studentUserStub.id;

    //         const result = await usersManagementService.deleteUser(id);

    //         expect(result).toBeUndefined();
    //         expect(usersRepository.deleteById).toHaveBeenCalledWith(id);
    //     });

    //     it("should throw NotFoundException if studentCourse to delete does not exist", async () => {
    //         const id = 99;

    //         await expect(usersManagementService.deleteUser(id)).rejects.toThrow(
    //             new NotFoundException(BaseErrorMessage.NOT_FOUND),
    //         );
    //         expect(usersRepository.getById).toHaveBeenCalledWith(id);
    //     });
    // });

    describe("get all users from the repository", () => {
        it("should return a list of users", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(usersRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<User>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                userMockList,
                userMockList.length,
            ]);
            jest.spyOn(usersViewModelFactory, "initUserListViewModel").mockReturnValue(userVMMList);

            const result = await usersManagementService.getAllUsers(queryParams);

            expect(result.totalRecords).toEqual(userMockList.length);
        });
    });

    describe("updateUser", () => {
        it("should successfully update a user", async () => {
            const userId = studentUserStub.id;

            const updateUserDto: UpdateUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: studentUserStub.email,
                groupId: groupStub.id,
            };
            studentUserStub.studentCourses = studentCoursesMockList;

            groupStub.groupCourses = [groupCoursesStub];

            jest.spyOn(usersRepository, "getByEmail").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupStub);
            jest.spyOn(usersRepository, "trxUpdate").mockResolvedValue(studentUserStub);
            jest.spyOn(studentCoursesRepository, "trxBulkCreate").mockResolvedValue(
                studentCoursesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxBulkDelete").mockResolvedValue(null);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                studentUserVMStub,
            );

            const result = await usersManagementService.updateUser(
                userId,
                updateUserDto,
                studentUserStub,
            );

            expect(result.id).toEqual(expect.any(Number));
            expect(result.email).toEqual(expect.any(String));
            expect(result.firstName).toEqual(expect.any(String));
            expect(result.lastName).toEqual(expect.any(String));
            expect(result.role).toEqual(expect.any(String));
            expect(result.group).toEqual(expect.any(String || null));
        });

        it("should successfully update a user(assign first course)", async () => {
            const userId = studentUserStub.id;

            const updateUserDto: UpdateUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                groupId: groupStub.id,
                roleId: studentRoleStub.id,
            };
            studentUserStub.studentCourses = [];

            groupStub.groupCourses = [groupCoursesStub];

            jest.spyOn(rolesRepository, "getById").mockResolvedValue(studentRoleStub);
            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupStub);
            jest.spyOn(usersRepository, "trxUpdate").mockResolvedValue(studentUserStub);
            jest.spyOn(studentCoursesRepository, "trxBulkCreate").mockResolvedValue(
                studentCoursesMockList,
            );
            jest.spyOn(studentCoursesRepository, "trxBulkDelete").mockResolvedValue(null);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                studentUserVMStub,
            );

            const result = await usersManagementService.updateUser(
                userId,
                updateUserDto,
                studentUserStub,
            );

            expect(result.id).toEqual(expect.any(Number));
            expect(result.email).toEqual(expect.any(String));
            expect(result.firstName).toEqual(expect.any(String));
            expect(result.lastName).toEqual(expect.any(String));
            expect(result.role).toEqual(expect.any(String));
            expect(result.group).toEqual(expect.any(String || null));
        });

        it("should throw a NotFoundException when user is not found", async () => {
            const userId = 1;
            const updateUserDto = new UpdateUserDto();

            jest.spyOn(usersRepository, "getById").mockResolvedValue(null);

            await expect(
                usersManagementService.updateUser(userId, updateUserDto, new User()),
            ).rejects.toThrow(new NotFoundException(BaseErrorMessage.NOT_FOUND));
            expect(usersRepository.getById).toHaveBeenCalledWith(userId);
        });

        it("should throw Group Not found err if provided wrong id", async () => {
            const userId = 1;

            const dto: UpdateUserDto = {
                groupId: 2222,
            };

            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);

            await expect(usersManagementService.updateUser(userId, dto, user)).rejects.toThrow(
                new NotFoundException("Group not found"),
            );
            expect(usersRepository.getById).toHaveBeenCalledWith(userId);
        });

        it("should throw Role Not found err if provided wrong id", async () => {
            const userId = 1;

            const dto: UpdateUserDto = {
                roleId: 2222,
            };

            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);

            await expect(usersManagementService.updateUser(userId, dto, user)).rejects.toThrow(
                new NotFoundException("Role not found"),
            );
            expect(usersRepository.getById).toHaveBeenCalledWith(userId);
        });

        it("should rollback transaction and throw error if an error occurs", async () => {
            const dto: UpdateUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
            };

            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(usersRepository, "trxUpdate").mockResolvedValue(studentUserStub);

            jest.spyOn(usersRepository, "trxUpdate").mockImplementation(async () => {
                throw new Error("Test error");
            });
            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                const result = await usersManagementService.updateUser(
                    studentUserStub.id,
                    dto,
                    user,
                );

                expect(result).toBeUndefined();
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(usersRepository.rollbackTrx).toHaveBeenCalledTimes(1);
            }
        });
    });

    describe("getUser", () => {
        it("should return a UserViewModel when user is found", async () => {
            const userId = studentUserStub.id;

            jest.spyOn(usersRepository, "getById").mockResolvedValue(studentUserStub);
            jest.spyOn(usersViewModelFactory, "initUserViewModel").mockReturnValue(
                studentUserVMStub,
            );

            const result = await usersManagementService.getUser(userId);

            expect(result).toBe(studentUserVMStub);
            expect(usersRepository.getById).toHaveBeenCalledWith(userId);
            expect(usersViewModelFactory.initUserViewModel).toHaveBeenCalledWith(studentUserStub);
        });

        it("should throw a NotFoundException when user is not found", async () => {
            const userId = studentUserStub.id;
            jest.spyOn(usersRepository, "getById").mockResolvedValue(null);

            await expect(usersManagementService.getUser(userId)).rejects.toThrow(
                new NotFoundException("User not found"),
            );
            expect(usersRepository.getById).toHaveBeenCalledWith(userId);
        });
    });
});

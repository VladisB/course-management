import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { lessonMockList, studentRoleStub, studentUserStub } from "@app/common/test/stubs";
import { BaseErrorMessage, RoleName } from "@app/common/enum";
import { UsersRepository } from "../users.repository";
import { User } from "../entities/user.entity";
import { mockUsersRepository } from "@app/lesson-grades/tests/mocks";
import { mockQueryBuilder } from "@app/common/test/mocks";

const tableName = "user";
const queryBuilderMock = mockQueryBuilder<User>(lessonMockList);

describe("UsersRepository", () => {
    let usersRepository: UsersRepository;

    const entityRepositoryToken = getRepositoryToken(User);
    let entityRepository: Repository<User>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UsersRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockUsersRepository(),
                },
            ],
        }).compile();

        usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("create a user", () => {
        it("should save a new user and return the saved user", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValueOnce(studentUserStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValueOnce(studentUserStub);

            const result = await usersRepository.create(studentUserStub);

            expect(entityRepository.save).toHaveBeenCalledWith(studentUserStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id },
                relations: { role: true, group: true, studentCourses: true },
            });
            expect(result).toEqual(studentUserStub);
        });
    });

    describe("trxCreate", () => {
        it("should call trxCreate on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(studentUserStub),
                    findOne: jest.fn().mockResolvedValue(studentUserStub),
                },
            } as any;

            jest.spyOn(entityRepository, "save").mockResolvedValue(studentUserStub);

            await usersRepository.trxCreate(trx, studentUserStub);

            expect(trx.manager.save).toHaveBeenCalledWith(studentUserStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(trx.manager.findOne).toHaveBeenCalledTimes(1);
        });

        it("should throw an err on the repository", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await usersRepository.trxCreate(trx, studentUserStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const entityId = 1;

            await usersRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await usersRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                leftJoinAndSelect: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<User>,
            );

            usersRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "user.role",
                "role",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "user.group",
                "group",
            );
        });
    });

    describe("getAllStudentsQ", () => {
        it("should return a query builder with the correct joins and conditions", () => {
            const localQueryBuilderMock = {
                createQueryBuilder: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<User>,
            );

            const result = usersRepository.getAllStudentsQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith("user");
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "user.role",
                "role",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "user.group",
                "group",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "user.studentCourses",
                "studentCourses",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "studentCourses.course",
                "course",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith("role.name = :roleName", {
                roleName: RoleName.Student,
            });
            expect(result).toBe(localQueryBuilderMock);
        });
    });

    describe("getByEmail", () => {
        it("should return a user with the given email", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentUserStub);

            const result = await usersRepository.getByEmail(studentUserStub.email);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { email: studentUserStub.email },
            });
            expect(result).toEqual(studentUserStub);
        });

        it("should return null if no user with the given email is found", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await usersRepository.getByEmail(studentUserStub.email);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { email: studentUserStub.email },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getById", () => {
        it("should return a user with the given id", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentUserStub);

            const result = await usersRepository.getById(studentUserStub.id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id },
                relations: { role: true, group: true, studentCourses: true },
            });
            expect(result).toEqual(studentUserStub);
        });

        it("should return null if no user with the given id is found", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await usersRepository.getById(studentUserStub.id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id },
                relations: { role: true, group: true, studentCourses: true },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getStudentById", () => {
        it("should return a student with the given id", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentUserStub);

            const result = await usersRepository.getStudentById(studentUserStub.id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id, role: { name: RoleName.Student } },
                relations: ["role", "group", "studentCourses", "studentCourses.course"],
            });
            expect(result).toEqual(studentUserStub);
        });

        it("should return null if no student with the given id is found", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await usersRepository.getStudentById(studentUserStub.id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id, role: { name: RoleName.Student } },
                relations: ["role", "group", "studentCourses", "studentCourses.course"],
            });

            expect(result).toEqual(null);
        });
    });

    describe("getByIdList", () => {
        it("should return a list of users with the given ids", async () => {
            jest.spyOn(entityRepository, "find").mockResolvedValue([studentUserStub]);

            const result = await usersRepository.getByIdList(
                [studentUserStub.id],
                studentRoleStub.id,
            );

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: { id: In([studentUserStub.id]), role: { id: studentRoleStub.id } },
                relations: { role: true },
            });
            expect(result).toEqual([studentUserStub]);
        });

        it("should return an empty list if no users with the given ids are found", async () => {
            jest.spyOn(entityRepository, "find").mockResolvedValue([]);

            const result = await usersRepository.getByIdList(
                [studentUserStub.id],
                studentRoleStub.id,
            );

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: { id: In([studentUserStub.id]), role: { id: studentRoleStub.id } },
                relations: { role: true },
            });
            expect(result).toEqual([]);
        });
    });

    describe("trxUpdate", () => {
        it("should call trxUpdate on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(studentUserStub),
                    save: jest.fn().mockResolvedValue(studentUserStub),
                },
            } as any;

            await usersRepository.trxUpdate(trx, studentUserStub);

            expect(trx.manager.save).toHaveBeenCalledWith(studentUserStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
        });

        it("should call save on the repository with wrong id", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(null),
                    save: jest.fn().mockResolvedValue(studentUserStub),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await usersRepository.trxUpdate(trx, studentUserStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });

        it("should throw an err on the repository", async () => {
            const trx: QueryRunner = {
                manager: {
                    findOne: jest.fn().mockResolvedValue(studentUserStub),
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await usersRepository.trxUpdate(trx, studentUserStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("updateRefreshToken", () => {
        it("should call update on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "update").mockResolvedValue(null);

            const refreshToken = "refreshToken";

            await usersRepository.updateRefreshToken(studentUserStub.id, refreshToken);

            expect(entityRepository.update).toHaveBeenCalledWith(
                { id: studentUserStub.id },
                { refreshToken },
            );
            expect(entityRepository.update).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if upadte is fail", async () => {
            jest.spyOn(entityRepository, "update").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            const refreshToken = "refreshToken";

            try {
                await usersRepository.updateRefreshToken(studentUserStub.id, refreshToken);

                expect(entityRepository.update).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("update", () => {
        it("should call update on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(studentUserStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(studentUserStub);

            await usersRepository.update(studentUserStub);

            expect(entityRepository.save).toHaveBeenCalledWith(studentUserStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { id: studentUserStub.id },
                relations: { role: true, group: true, studentCourses: true },
            });
        });

        it("should throw an error if upadte is fail", async () => {
            jest.spyOn(entityRepository, "update").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await usersRepository.update(studentUserStub);

                expect(entityRepository.update).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });
});

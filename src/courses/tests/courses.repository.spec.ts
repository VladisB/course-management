import { BaseErrorMessage } from "@app/common/enum";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { courseMockList, courseStub } from "@app/common/test/stubs";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { Course } from "../entities/course.entity";
import { CoursesRepository } from "../courses.repository";
import { mockCoursesRepository } from "./mocks";

const tableName = "course";
const queryBuilderMock = mockQueryBuilder<Course>(courseMockList);

describe("CoursesRepository", () => {
    let coursesRepository: CoursesRepository;

    const entityRepositoryToken = getRepositoryToken(Course);
    let entityRepository: Repository<Course>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CoursesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockCoursesRepository(),
                },
            ],
        }).compile();

        coursesRepository = moduleRef.get<CoursesRepository>(CoursesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getByName", () => {
        it("should return a course if it exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const result = await coursesRepository.getByName(courseStub.name);

            expect(result).toEqual(courseStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    name: courseStub.name,
                },
            });
        });

        it("should return null if role doesn't exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await coursesRepository.getByName(courseStub.name);

            expect(result).toEqual(null);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    name: courseStub.name,
                },
            });
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const result = await coursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: [
                    "courseInstructors",
                    "courseInstructors.instructor",
                    "groupCourses",
                    "studentCourses",
                ],
            });
            expect(result).toEqual(courseStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await coursesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: [
                    "courseInstructors",
                    "courseInstructors.instructor",
                    "groupCourses",
                    "studentCourses",
                ],
            });
            expect(result).toEqual(null);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                leftJoinAndSelect: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Course>,
            );

            coursesRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.courseInstructors`,
                "courseInstructors",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                "courseInstructors.instructor",
                "users",
            );
        });
    });

    describe("getAllByStudentId", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "find").mockResolvedValue(courseMockList);

            const result = await coursesRepository.getAllByStudentId(id);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    studentCourses: { studentId: id },
                },
                relations: ["studentCourses"],
            });
            expect(result).toEqual(courseMockList);
        });
    });

    describe("getByIdList", () => {
        it("should call find on the repository with the correct parameters", async () => {
            const idList: number[] = [1];

            jest.spyOn(entityRepository, "find").mockResolvedValue(courseMockList);

            const result = await coursesRepository.getByIdList(idList);

            expect(entityRepository.find).toHaveBeenCalledWith({
                where: {
                    id: In(idList),
                },
                relations: ["courseInstructors", "courseInstructors.instructor"],
            });
            expect(result).toEqual(courseMockList);
        });
    });

    describe("create a course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(courseStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const result = await coursesRepository.create(courseStub);

            expect(entityRepository.save).toHaveBeenCalledWith(courseStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.name).toEqual(courseStub.name);
            expect(result.available).toEqual(courseStub.available);
        });
    });

    describe("create a course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(courseStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const result = await coursesRepository.create(courseStub);

            expect(entityRepository.save).toHaveBeenCalledWith(courseStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(courseStub);
        });

        it("should throw an err on the repository", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await coursesRepository.create(courseStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("trxCreate a course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(courseStub),
                },
            } as any;

            const result = await coursesRepository.trxCreate(trx, courseStub);

            expect(trx.manager.save).toHaveBeenCalledWith(courseStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(courseStub);
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
                await coursesRepository.trxCreate(trx, courseStub);

                expect(trx.manager.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("update a course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(courseStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const result = await coursesRepository.update(courseStub);

            expect(entityRepository.save).toHaveBeenCalledWith(courseStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);

            expect(result.id).toEqual(expect.any(Number));
            expect(result.name).toEqual(courseStub.name);
            expect(result.available).toEqual(courseStub.available);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            courseStub.id = 999;

            try {
                await coursesRepository.update(courseStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("trxUpdate a course", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockResolvedValue(courseStub),
                },
            } as any;

            const result = await coursesRepository.trxUpdate(trx, courseStub);

            expect(trx.manager.save).toHaveBeenCalledWith(courseStub);
            expect(trx.manager.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(courseStub);
        });

        it("should call save on the repository with wrong id", async () => {
            const trx: QueryRunner = {
                manager: {
                    save: jest.fn().mockImplementation(async () => {
                        throw new Error(BaseErrorMessage.DB_ERROR);
                    }),
                },
            } as any;

            jest.spyOn(console, "error").mockImplementation((err) => err);

            courseStub.id = 999;

            try {
                await coursesRepository.trxUpdate(trx, courseStub);

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

            await coursesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await coursesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("isAssignedToGroup", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(courseStub);

            const entityId = 1;

            const result = await coursesRepository.isAssignedToGroup(entityId);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: entityId,
                },
                relations: ["groupCourses"],
            });
            expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expect.any(Boolean));
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await coursesRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

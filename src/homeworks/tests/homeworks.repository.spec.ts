import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { lessonMockList, lessonStub } from "@app/common/test/stubs";
import { BaseErrorMessage } from "@app/common/enum";
import { mockQueryBuilder } from "@app/common/test/mocks";
import { mockHomeworksRepository } from "./mocks";
import { Homework } from "../entities/homework.entity";
import { HomeworksRepository } from "../homeworks.repository";
import { homeworkStub } from "@app/common/test/stubs/homework.stub";

const tableName = "homework";
const queryBuilderMock = mockQueryBuilder<Homework>(lessonMockList);

describe("HomeworksRepository", () => {
    let homeworksRepository: HomeworksRepository;

    const entityRepositoryToken = getRepositoryToken(Homework);
    let entityRepository: Repository<Homework>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                HomeworksRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockHomeworksRepository(),
                },
            ],
        }).compile();

        homeworksRepository = moduleRef.get<HomeworksRepository>(HomeworksRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("create a homework", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(homeworkStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(homeworkStub);

            const result = await homeworksRepository.create(homeworkStub);

            expect(entityRepository.save).toHaveBeenCalledWith(homeworkStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                id: expect.any(Number),
                lesson: expect.any(Object),
                student: expect.any(Object),
                filePath: expect.any(String),
                createdBy: expect.any(Object),
                modifiedBy: expect.any(Object),
                createdAt: expect.any(Date),
                modifiedAt: expect.any(Date),
            });
        });

        it("should call save on the repository with wrong parameters", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            try {
                await homeworksRepository.create(homeworkStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
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

            await homeworksRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const entityId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(undefined);

            const result = await homeworksRepository.deleteById(entityId);

            expect(entityRepository.delete).toHaveBeenCalledWith(entityId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });

    describe("getAllByStudentQ", () => {
        it("should call createQueryBuilder on the repository", async () => {
            const studentId = 1;

            const localQueryBuilderMock = {
                ...queryBuilderMock,
                leftJoinAndSelect: jest.fn(() => localQueryBuilderMock),
                where: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Homework>,
            );

            homeworksRepository.getAllByStudentQ(studentId);

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.student`,
                "student",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.createdBy`,
                "createdBy",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.modifiedBy`,
                "modifiedBy",
            );
            expect(localQueryBuilderMock.where).toHaveBeenCalledWith(
                `${tableName}.student.id = :studentId`,
                { studentId },
            );
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", async () => {
            const localQueryBuilderMock = {
                ...queryBuilderMock,
                leftJoinAndSelect: jest.fn(() => localQueryBuilderMock),
                where: jest.fn(() => localQueryBuilderMock),
            };

            jest.spyOn(entityRepository, "createQueryBuilder").mockReturnValue(
                localQueryBuilderMock as any as SelectQueryBuilder<Homework>,
            );

            homeworksRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.student`,
                "student",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.createdBy`,
                "createdBy",
            );
            expect(localQueryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(
                `${tableName}.modifiedBy`,
                "modifiedBy",
            );
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(homeworkStub);

            const result = await homeworksRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    lesson: {
                        course: true,
                    },
                    student: true,
                    createdBy: true,
                    modifiedBy: true,
                },
            });
            expect(result).toEqual(homeworkStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await homeworksRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
                relations: {
                    lesson: {
                        course: true,
                    },
                    student: true,
                    createdBy: true,
                    modifiedBy: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getByLesson", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const lessonId = 1;
            const studentId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(homeworkStub);

            const result = await homeworksRepository.getByLesson(lessonId, studentId);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    student: { id: studentId },
                    lesson: { id: lessonId },
                },
                relations: {
                    lesson: true,
                    student: true,
                    createdBy: true,
                    modifiedBy: true,
                },
            });
            expect(result).toEqual(homeworkStub);
        });

        it("should return null if entity not found", async () => {
            const lessonId = 1;
            const studentId = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await homeworksRepository.getByLesson(lessonId, studentId);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    student: { id: studentId },
                    lesson: { id: lessonId },
                },
                relations: {
                    lesson: true,
                    student: true,
                    createdBy: true,
                    modifiedBy: true,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("update homework", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(homeworkStub);
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(homeworkStub);

            const result = await homeworksRepository.update(homeworkStub);

            expect(entityRepository.save).toHaveBeenCalledWith(homeworkStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(homeworkStub);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            lessonStub.id = 999;

            try {
                await homeworksRepository.update(homeworkStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });
});

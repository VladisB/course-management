import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseErrorMessage } from "@app/common/enum";
import { FacultiesRepository } from "../faculties.repository";
import { Faculty } from "../entities/faculty.entity";
import { facultyCSStub } from "@app/common/test/stubs";
import { mockFacultiesRepository } from "./mocks";

const tableName = "faculty";

describe("FaclutiesRepository", () => {
    let facultiesRepository: FacultiesRepository;
    const entityRepositoryToken = getRepositoryToken(Faculty);
    let entityRepository: Repository<Faculty>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                FacultiesRepository,
                {
                    provide: entityRepositoryToken,
                    useValue: mockFacultiesRepository(),
                },
            ],
        }).compile();

        facultiesRepository = moduleRef.get<FacultiesRepository>(FacultiesRepository);
        entityRepository = moduleRef.get(entityRepositoryToken);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getByName", () => {
        it("should return the faculty if it exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(facultyCSStub);

            const result = await facultiesRepository.getByName(facultyCSStub.name);

            expect(result).toEqual(facultyCSStub);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: facultyCSStub.name },
            });
        });

        it("should return null if faculty doesn't exists", async () => {
            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);
            const facultyName = "test faculty name";

            const result = await facultiesRepository.getByName(facultyName);

            expect(result).toEqual(null);
            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: { name: facultyName },
            });
        });
    });

    describe("getById", () => {
        it("should call findOne on the repository with the correct parameters", async () => {
            const id = 1;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(facultyCSStub);

            const result = await facultiesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
            });
            expect(result).toEqual(facultyCSStub);
        });

        it("should return null if entity not found", async () => {
            const id = 99;

            jest.spyOn(entityRepository, "findOne").mockResolvedValue(null);

            const result = await facultiesRepository.getById(id);

            expect(entityRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                },
            });
            expect(result).toEqual(null);
        });
    });

    describe("getAllQ", () => {
        it("should call createQueryBuilder on the repository", () => {
            facultiesRepository.getAllQ();

            expect(entityRepository.createQueryBuilder).toHaveBeenCalledWith(tableName);
        });
    });

    describe("create a faculty", () => {
        it("should call save on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "save").mockResolvedValue(facultyCSStub);

            const result = await facultiesRepository.create(facultyCSStub);

            expect(entityRepository.save).toHaveBeenCalledWith(facultyCSStub);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(facultyCSStub);
        });
    });

    describe("update a faculty", () => {
        it("should call save on the repository with the correct parameters", async () => {
            const updatedFaculty = facultyCSStub;
            updatedFaculty.name = "updated name";

            jest.spyOn(entityRepository, "save").mockResolvedValue(updatedFaculty);

            const result = await facultiesRepository.update(updatedFaculty);

            expect(entityRepository.save).toHaveBeenCalledWith(updatedFaculty);
            expect(entityRepository.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(updatedFaculty);
        });

        it("should call save on the repository with wrong id", async () => {
            jest.spyOn(entityRepository, "save").mockImplementation(async () => {
                throw new Error(BaseErrorMessage.DB_ERROR);
            });

            jest.spyOn(console, "error").mockImplementation((err) => err);

            facultyCSStub.id = 99;

            try {
                await facultiesRepository.update(facultyCSStub);

                expect(entityRepository.save).toHaveBeenCalledTimes(1);
            } catch (err) {
                expect(console.error).toHaveBeenCalled();
                expect(err.message).toEqual(BaseErrorMessage.DB_ERROR);
            }
        });
    });

    describe("deleteById", () => {
        it("should call delete on the repository with the correct parameters", async () => {
            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const facultyId = 1;

            await facultiesRepository.deleteById(1);

            expect(entityRepository.delete).toHaveBeenCalledWith(facultyId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
        });

        it("should return null if entity doesn't exist", async () => {
            const facultyId = 99;

            jest.spyOn(entityRepository, "delete").mockResolvedValue(null);

            const result = await facultiesRepository.deleteById(facultyId);

            expect(entityRepository.delete).toHaveBeenCalledWith(facultyId);
            expect(entityRepository.delete).toHaveBeenCalledTimes(1);
            expect(result).toEqual(undefined);
        });
    });
});

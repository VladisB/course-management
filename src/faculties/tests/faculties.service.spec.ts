import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import { facultiesMockList, facultyCEStub, facultyCSStub } from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { Faculty } from "../entities/faculty.entity";
import { FacultiesViewModelFactory } from "../model-factories";
import { FacultiesService } from "../faculties.service";
import { IFacultiesRepository } from "../faculties.repository";
import { mockFacultiesRepository } from "./mocks";
import { CreateFacultyDto } from "../dto/create-faculty.dto";
import { UpdateFacultyDto } from "../dto/update-faculty.dto";

const queryBuilderMock = mockQueryBuilder<Faculty>(facultiesMockList);
const queryBuilderMockEmpty = mockQueryBuilder<Faculty>(facultiesMockList);

describe("FacultiesService", () => {
    let facultiesService: FacultiesService;
    let facultiesRepository: IFacultiesRepository;
    let facultiesViewModelFactory: FacultiesViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<Faculty>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FacultiesService,
                {
                    provide: IFacultiesRepository,
                    useValue: mockFacultiesRepository(),
                },
                { provide: FacultiesViewModelFactory, useClass: FacultiesViewModelFactory },
            ],
        }).compile();

        facultiesService = module.get<FacultiesService>(FacultiesService);
        facultiesRepository = module.get(IFacultiesRepository);
        facultiesViewModelFactory = module.get(FacultiesViewModelFactory);
        queryBuilder = queryBuilderMock;

        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("facultiesService should be defined", () => {
        expect(facultiesService).toBeDefined();
    });

    it("facultiesRepository should be defined", () => {
        expect(facultiesRepository).toBeDefined();
    });

    it("facultiesViewModelFactory should be defined", () => {
        expect(facultiesViewModelFactory).toBeDefined();
    });

    describe("create a faculty", () => {
        it("should save the new faculty", async () => {
            const dto: CreateFacultyDto = {
                name: "test",
            };

            const result = await facultiesService.createFaculty(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                name: dto.name,
            });
        });

        it("should throw an error if faculty already exists", async () => {
            const dto: CreateFacultyDto = {
                name: "test",
            };

            jest.spyOn(facultiesRepository, "getByName").mockResolvedValue(facultyCEStub);

            await expect(facultiesService.createFaculty(dto, user)).rejects.toThrowError(
                new ConflictException(`Faculty with name ${dto.name} already exists.`),
            );
        });
    });

    describe("get faculty by id", () => {
        it("should return faculty", async () => {
            const repoSpy = jest
                .spyOn(facultiesRepository, "getById")
                .mockResolvedValue(facultyCSStub);
            const id = 1;

            expect(await facultiesService.getFaculty(id)).toEqual({
                id: expect.any(Number),
                name: facultyCSStub.name,
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if faculty does not exist", async () => {
            const id = 99;

            expect(facultiesService.getFaculty(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(facultiesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete faculty by id", () => {
        it("should delete faculty", async () => {
            const repoSpy = jest
                .spyOn(facultiesRepository, "getById")
                .mockResolvedValue(facultyCSStub);
            const id = 1;

            expect(facultiesService.deleteFaculty(id)).resolves.toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if faculty to delete does not exist", async () => {
            const id = 99;

            await expect(facultiesService.deleteFaculty(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(facultiesRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all faculties from the repository", () => {
        it("should return a list of faculties", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(facultiesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Faculty>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                facultiesMockList,
                facultiesMockList.length,
            ]);
            jest.spyOn(facultiesViewModelFactory, "initFacultyListViewModel").mockReturnValue(
                facultiesMockList,
            );

            const result = await facultiesService.getFaculties(queryParams);

            const resultThemes = result.records.map((item) => item.name);
            const mockThemes = facultiesMockList.map((role) => role.name);

            expect(result.totalRecords).toEqual(facultiesMockList.length);
            expect(resultThemes).toEqual(mockThemes);
        });

        it("should return a empty list of roles", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(facultiesRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Faculty>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(facultiesViewModelFactory, "initFacultyListViewModel").mockReturnValue([]);

            const result = await facultiesService.getFaculties(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update faculty", () => {
        it("should return an updated faculty", async () => {
            const id = 1;

            const dto: UpdateFacultyDto = {
                name: "updated name",
            };

            jest.spyOn(facultiesRepository, "getById").mockResolvedValue(
                facultiesMockList.find((faculty) => faculty.id === id),
            );

            const result = await facultiesService.updateFaculty(id, dto, user);

            expect(result).toEqual({
                id: id,
                name: dto.name,
            });
        });

        it("should throw Error if provided name is not unique", async () => {
            const id = facultyCEStub.id;

            const dto: UpdateFacultyDto = {
                name: facultyCSStub.name,
            };

            jest.spyOn(facultiesRepository, "getById").mockResolvedValue(facultyCEStub);
            jest.spyOn(facultiesRepository, "getByName").mockResolvedValue(facultyCSStub);

            await expect(facultiesService.updateFaculty(id, dto, user)).rejects.toThrow(
                new ConflictException(`Faculty with name ${dto.name} already exists.`),
            );

            expect(facultiesRepository.getByName).toHaveBeenCalledWith(dto.name);
            expect(facultiesRepository.getById).toHaveBeenCalledWith(id);
        });

        it("should throw NotFoundException since updated faculty not found", async () => {
            const dto: UpdateFacultyDto = {
                name: "updated name",
            };

            const id = 99;

            expect(facultiesService.updateFaculty(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(facultiesRepository.getById).toHaveBeenCalledWith(id);
        });
    });
});

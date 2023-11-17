import { ApplyToQueryExtension } from "@app/common/query-extention";
import { BaseErrorMessage } from "@app/common/enum";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { QueryParamsDTO } from "@app/common/dto/query-params.dto";
import { SelectQueryBuilder } from "typeorm";
import { Test } from "@nestjs/testing";
import { User } from "@app/users/entities/user.entity";
import {
    courseStub,
    facultyCEStub,
    groupMockList,
    groupStub,
    groupVMMockList,
} from "@app/common/test/stubs";
import { mockQueryBuilder } from "@common/test/mocks";
import { Group } from "../entities/group.entity";
import { GroupsService } from "../groups.service";
import { GroupsViewModelFactory } from "../model-factories";
import { ICoursesRepository } from "@app/courses/courses.repository";
import { IFacultiesRepository } from "@app/faculties/faculties.repository";
import { IGroupsRepository } from "../groups.repository";
import {
    mockCoursesRepository,
    mockFacultiesRepository,
    mockGroupCoursesRepository,
    mockGroupsRepository,
} from "./mocks";
import { IGroupCoursesRepository } from "../group-courses.repository";
import { GroupViewModel } from "../view-models";
import { CreateGroupDto } from "../dto/create-group.dto";
import { UpdateGroupDto } from "../dto/update-group.dto";

const queryBuilderMock = mockQueryBuilder<Group>(groupMockList);
const queryBuilderMockEmpty = mockQueryBuilder<Group>(groupMockList);

describe("GroupsService", () => {
    let groupsService: GroupsService;
    let coursesRepository: ICoursesRepository;
    let groupCoursesRepository: IGroupCoursesRepository;
    let facultiesRepository: IFacultiesRepository;
    let groupsRepository: IGroupsRepository;
    let groupViewModelFactory: GroupsViewModelFactory;
    let queryBuilder: Partial<SelectQueryBuilder<Group>>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GroupsService,
                {
                    provide: IGroupsRepository,
                    useValue: mockGroupsRepository(),
                },
                {
                    provide: IGroupCoursesRepository,
                    useValue: mockGroupCoursesRepository(),
                },
                {
                    provide: ICoursesRepository,
                    useValue: mockCoursesRepository(),
                },
                {
                    provide: IFacultiesRepository,
                    useValue: mockFacultiesRepository(),
                },
                { provide: GroupsViewModelFactory, useClass: GroupsViewModelFactory },
            ],
        }).compile();

        groupsService = module.get<GroupsService>(GroupsService);
        groupsRepository = module.get(IGroupsRepository);
        groupCoursesRepository = module.get(IGroupCoursesRepository);
        facultiesRepository = module.get(IFacultiesRepository);
        coursesRepository = module.get(ICoursesRepository);
        groupViewModelFactory = module.get(GroupsViewModelFactory);
        queryBuilder = queryBuilderMock;
        user = new User();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("GroupsService should be defined", () => {
        expect(groupsService).toBeDefined();
    });

    it("groupsRepository should be defined", () => {
        expect(groupsRepository).toBeDefined();
    });

    it("groupViewModelFactory should be defined", () => {
        expect(groupViewModelFactory).toBeDefined();
    });

    describe("create a group", () => {
        it("should save the new group", async () => {
            const dto: CreateGroupDto = {
                name: "test",
                facultyId: 1,
            };

            jest.spyOn(facultiesRepository, "getById").mockResolvedValue(facultyCEStub);
            jest.spyOn(groupsRepository, "create").mockResolvedValue(groupStub);
            const result = await groupsService.createGroup(dto, user);

            expect(result).toEqual({
                id: expect.any(Number),
                groupName: expect.any(String),
                facultyName: expect.any(String),
                courses: expect.any(Array),
            });
        });

        it("should throw an error if group already exists", async () => {
            const dto: CreateGroupDto = {
                name: groupStub.name,
                facultyId: 1,
            };

            jest.spyOn(groupsRepository, "getByName").mockResolvedValue(groupStub);

            await expect(groupsService.createGroup(dto, user)).rejects.toThrowError(
                new ConflictException(`Group with name ${dto.name} already exists.`),
            );
        });

        it("should throw an error if faculty doesn't exists", async () => {
            const dto: CreateGroupDto = {
                name: groupStub.name,
                facultyId: 1,
            };

            await expect(groupsService.createGroup(dto, user)).rejects.toThrowError(
                new BadRequestException("Provided faculty does not exist"),
            );
        });
    });

    describe("get group", () => {
        it("should return group", async () => {
            const repoSpy = jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupStub);
            const id = 1;

            expect(await groupsService.getGroup(id)).toEqual({
                id: expect.any(Number),
                groupName: expect.any(String),
                facultyName: expect.any(String),
                courses: expect.any(Array),
            });
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if group does not exist", async () => {
            const id = 99;
            expect(groupsService.getGroup(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(groupsRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("delete group by id", () => {
        it("should delete group", async () => {
            const repoSpy = jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupStub);
            const id = 1;

            expect(groupsService.deleteGroup(id)).resolves.toBeUndefined();
            expect(repoSpy).toBeCalledWith(id);
        });

        it("should throw NotFoundException if group to delete does not exist", async () => {
            const id = 99;

            await expect(groupsService.deleteGroup(id)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(groupsRepository.getById).toHaveBeenCalledWith(id);
        });
    });

    describe("get all groups from the repository", () => {
        it("should return a list of groups", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(groupsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Group>,
            );
            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([
                groupMockList,
                groupMockList.length,
            ]);
            jest.spyOn(groupViewModelFactory, "initGroupListViewModel").mockReturnValue(
                groupVMMockList,
            );

            const result = await groupsService.getGroups(queryParams);

            const resultNames = result.records.map((item: GroupViewModel) => item.groupName);
            const mockNames = groupMockList.map((item: Group) => item.name);

            expect(result.totalRecords).toEqual(groupVMMockList.length);
            expect(resultNames).toEqual(mockNames);
        });

        it("should return a empty list of groups", async () => {
            const queryParams: QueryParamsDTO = {};

            jest.spyOn(groupsRepository, "getAllQ").mockReturnValue(
                queryBuilderMock as unknown as SelectQueryBuilder<Group>,
            );

            jest.spyOn(ApplyToQueryExtension, "applyToQuery").mockResolvedValue([[], 0]);
            jest.spyOn(groupViewModelFactory, "initGroupListViewModel").mockReturnValue([]);

            const result = await groupsService.getGroups(queryParams);

            expect(result.totalRecords).toEqual(0);
            expect(result.records).toEqual([]);
        });
    });

    describe("update group", () => {
        it("should return an updated group", async () => {
            const groupId = 1;
            const courseList = [courseStub];

            const dto: UpdateGroupDto = {
                name: "updated name",
                facultyId: 1,
                courseIdList: courseList.map((r) => r.id),
            };

            const groupToUpdate = groupMockList.find((r) => r.id === groupId);
            groupToUpdate.name = dto.name;

            jest.spyOn(groupsRepository, "getById").mockResolvedValue(
                groupMockList.find((r) => r.id === groupId),
            );
            jest.spyOn(coursesRepository, "getByIdList").mockResolvedValue(courseList);
            jest.spyOn(facultiesRepository, "getById").mockResolvedValue(facultyCEStub);
            jest.spyOn(groupsRepository, "getById").mockResolvedValue(groupToUpdate);

            const result = await groupsService.updateGroup(groupId, dto, user);

            expect(result).toEqual({
                id: groupId,
                courses: expect.any(Array),
                facultyName: expect.any(String),
                groupName: dto.name,
            });
        });

        it("should throw Error if provided courses doesn't exist", async () => {
            const courseId = 999;

            const dto: UpdateGroupDto = {
                name: "updated name",
                courseIdList: [courseId],
                facultyId: 1,
            };

            const groupId = 1;

            const groupToUpdate = groupMockList.find((r) => r.id === groupId);
            groupToUpdate.name = dto.name;

            jest.spyOn(groupsRepository, "getById").mockResolvedValue(
                groupMockList.find((r) => r.id === groupId),
            );
            jest.spyOn(coursesRepository, "getByIdList").mockResolvedValue([]);

            await expect(groupsService.updateGroup(groupId, dto, user)).rejects.toThrowError(
                new BadRequestException("Course(s) not found."),
            );
            expect(coursesRepository.getByIdList).toHaveBeenCalledWith(dto.courseIdList);
        });

        it("should throw Error if provided faculty doesn't exist", async () => {
            const courseList = [courseStub];

            const dto: UpdateGroupDto = {
                name: "updated name",
                courseIdList: courseList.map((r) => r.id),
                facultyId: 99,
            };

            const groupId = 1;

            const groupToUpdate = groupMockList.find((r) => r.id === groupId);
            groupToUpdate.name = dto.name;

            jest.spyOn(groupsRepository, "getById").mockResolvedValue(
                groupMockList.find((r) => r.id === groupId),
            );
            jest.spyOn(coursesRepository, "getByIdList").mockResolvedValue(courseList);

            await expect(groupsService.updateGroup(groupId, dto, user)).rejects.toThrowError(
                new BadRequestException("Provided faculty does not exist"),
            );
            expect(facultiesRepository.getById).toHaveBeenCalledWith(dto.facultyId);
        });

        it("should throw NotFoundException since updated group not found", async () => {
            const dto: UpdateGroupDto = {
                name: "updated name",
            };

            const id = 99;

            expect(groupsService.updateGroup(id, dto, user)).rejects.toThrow(
                new NotFoundException(BaseErrorMessage.NOT_FOUND),
            );
            expect(groupsRepository.getById).toHaveBeenCalledWith(id);
        });
    });
});

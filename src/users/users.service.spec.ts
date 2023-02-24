import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RolesService } from "../roles/roles.service";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

const mockTaskRepository = () => ({
    getAllUsers: jest.fn(),
});

const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

describe("UsersService", () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: USER_REPOSITORY_TOKEN, useFactory: mockTaskRepository },
                {
                    provide: RolesService,
                    useValue: {
                        method1: jest.fn(),
                        method2: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersService = await module.get<UsersService>(UsersService);
        usersRepository = module.get(USER_REPOSITORY_TOKEN);
    });

    it("usersService should be defined", () => {
        expect(usersService).toBeDefined();
    });

    it("usersRepository should be defined", () => {
        expect(usersRepository).toBeDefined();
    });

    // describe("Gets all tasks from the repository", () => {
    //     it("should return an array of users", async () => {
    //         const tasks = await tasksService.getAllTasks();

    //         expect(tasks).toEqual(taskArray);
    //     });
    // });

    // describe("get a task", () => {
    //     it("calls taskRepository.findOneBy() and successfully retrieve and return the task", async () => {
    //         const repoSpy = jest.spyOn(tasksRepository, "findOneBy");

    //         expect(tasksService.getTask(1)).resolves.toEqual(singleTask);
    //         expect(repoSpy).toBeCalledWith({ id: 1 });
    //     });

    //     it("throws an error as task is not found ", async () => {
    //         const repoSpy = jest.spyOn(tasksRepository, "findOneBy");
    //         jest.spyOn(tasksService, "getTask").mockRejectedValue(NotFoundException);

    //         await expect(tasksService.getTask(100)).rejects.toThrow();
    //     });
    // });

    // describe("create a task", () => {
    //     it("should save the new task", async () => {
    //         jest.spyOn(tasksRepository, "create");

    //         const createTaskDto: CreateTaskDto = {
    //             title: "Test task",
    //             description: "Test description",
    //         };

    //         const result = await tasksService.createTask(createTaskDto);

    //         expect(tasksService.createTask(createTaskDto)).resolves.toEqual(result);
    //         expect(tasksService.createTask(createTaskDto)).resolves.toBeInstanceOf(Task);
    //     });
    // });
});

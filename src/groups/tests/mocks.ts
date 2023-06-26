import { CreateGroupDto } from "../dto/create-group.dto";

const groupsMock = [
    {
        id: 1,
        name: "SPRm-20-2",
    },
    {
        id: 2,
        name: "CS-22-1",
    },
];

const createDto: CreateGroupDto = {
    name: "mock group",
    facultyId: 2,
};

export { groupsMock, createDto };

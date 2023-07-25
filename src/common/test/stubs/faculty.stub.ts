import { Faculty } from "@app/faculties/entities/faculty.entity";

const facultyCSStub = new Faculty();
facultyCSStub.id = 1;
facultyCSStub.name = "Computer Science";

const facultyCEStub = new Faculty();
facultyCEStub.id = 2;
facultyCEStub.name = "Computer engineering";

const facultiesMockList = [facultyCSStub, facultyCEStub];

export { facultiesMockList, facultyCSStub, facultyCEStub };

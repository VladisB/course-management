import { Faculty } from "@app/faculties/entities/faculty.entity";
import { FacultyViewModel } from "@app/faculties/view-models";

const facultyCSStub = new Faculty();
facultyCSStub.id = 1;
facultyCSStub.name = "Computer Science";

const facultyCEStub = new Faculty();
facultyCEStub.id = 2;
facultyCEStub.name = "Computer engineering";

const facultiesMockList = [facultyCSStub, facultyCEStub];

const facultyVMStub = new FacultyViewModel();
const facultyVMMockList: FacultyViewModel[] = [facultyVMStub];

export { facultiesMockList, facultyCSStub, facultyCEStub, facultyVMMockList };

import { User } from "@app/users/entities/user.entity";
import { adminRoleStub, instructorRoleStub, studentRoleStub, unexistedRoleStub } from "./role.stub";
import { getRandomNumber } from "../utils";
import { E2ETestData } from "@app/common/enum";
import { StudentListViewModel } from "@app/students/view-models";
import { UserViewModel } from "@app/users/view-models";

const adminUserStub: User = new User();
adminUserStub.id = 1;
adminUserStub.email = "admin@unexisted.com";
adminUserStub.firstName = "John Admin";
adminUserStub.lastName = "Doe";
adminUserStub.role = adminRoleStub;
adminUserStub.group = null;

const studentUserStub: User = new User();
studentUserStub.id = 2;
studentUserStub.email = "student@unexisted.com";
studentUserStub.firstName = "John Student";
studentUserStub.lastName = "Doe";
studentUserStub.role = studentRoleStub;
studentUserStub.group = null;

const studentUserStub2: User = new User();
studentUserStub2.id = 4;
studentUserStub2.email = "student@unexisted2.com";
studentUserStub2.firstName = "John Student2";
studentUserStub2.lastName = "Doe";
studentUserStub2.role = studentRoleStub;
studentUserStub2.group = null;

const studentMockList: User[] = [studentUserStub, studentUserStub2];

const studentVMStub = new StudentListViewModel();
studentVMStub.id = studentUserStub.id;
studentVMStub.email = studentUserStub.email;
studentVMStub.firstName = studentUserStub.firstName;
studentVMStub.lastName = studentUserStub.lastName;
studentVMStub.group = null;

const studentVMStub2 = new StudentListViewModel();
studentVMStub2.id = studentUserStub2.id;
studentVMStub2.email = studentUserStub2.email;
studentVMStub2.firstName = studentUserStub2.firstName;
studentVMStub2.lastName = studentUserStub2.lastName;
studentVMStub2.group = null;

const studentVMMockList: StudentListViewModel[] = [studentVMStub, studentVMStub2];

const studentUserVMStub = new UserViewModel();
studentUserVMStub.id = studentUserStub.id;
studentUserVMStub.email = studentUserStub.email;
studentUserVMStub.firstName = studentUserStub.firstName;
studentUserVMStub.lastName = studentUserStub.lastName;
studentUserVMStub.role = studentUserStub.role.name;
studentUserVMStub.group = "group name";

const instructorUserStub: User = new User();
instructorUserStub.id = 3;
instructorUserStub.email = "instructor@unexisted.com";
instructorUserStub.firstName = "John Instructor";
instructorUserStub.lastName = "Doe";
instructorUserStub.role = instructorRoleStub;
instructorUserStub.group = null;

const instructorUserVMStub = new UserViewModel();
instructorUserVMStub.id = instructorUserStub.id;
instructorUserVMStub.email = instructorUserStub.email;
instructorUserVMStub.firstName = instructorUserStub.firstName;
instructorUserVMStub.lastName = instructorUserStub.lastName;
instructorUserVMStub.role = instructorUserStub.role.name;
instructorUserVMStub.group = null;

const unexistedUserStub: User = new User();
unexistedUserStub.id = 3;
unexistedUserStub.email = "unexisted@unexisted.com";
unexistedUserStub.firstName = "unexisted";
unexistedUserStub.lastName = "Doe";
unexistedUserStub.role = unexistedRoleStub;
unexistedUserStub.group = null;

const e2eInstructorStub: Partial<User> = {
    email: `e2eInstructor${getRandomNumber()}@gmail.com`,
    password: E2ETestData.password,
    firstName: "John",
    lastName: "Deer",
};

const userMockList: User[] = [adminUserStub, studentUserStub, instructorUserStub];
const userVMMList: UserViewModel[] = [studentUserVMStub, instructorUserVMStub];

export {
    adminUserStub,
    studentUserStub,
    instructorUserStub,
    unexistedUserStub,
    e2eInstructorStub,
    studentMockList,
    studentVMMockList,
    studentUserVMStub,
    instructorUserVMStub,
    userMockList,
    userVMMList,
};

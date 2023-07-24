import { User } from "@app/users/entities/user.entity";
import { adminRoleStub, instructorRoleStub, studentRoleStub, unexistedRoleStub } from "./role.stub";
import { getRandomNumber } from "../utils";
import { E2ETestData } from "@app/common/enum";

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

const instructorUserStub: User = new User();
instructorUserStub.id = 3;
instructorUserStub.email = "instructor@unexisted.com";
instructorUserStub.firstName = "John Instructor";
instructorUserStub.lastName = "Doe";
instructorUserStub.role = instructorRoleStub;
instructorUserStub.group = null;

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

export { adminUserStub, studentUserStub, instructorUserStub, unexistedUserStub, e2eInstructorStub };

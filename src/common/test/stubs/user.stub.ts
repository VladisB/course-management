import { User } from "@app/users/entities/user.entity";
import { adminRoleStub, instructorRoleStub, studentRoleStub } from "./role.stub";

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

export { adminUserStub, studentUserStub, instructorUserStub };

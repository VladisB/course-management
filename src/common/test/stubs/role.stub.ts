import { RoleName } from "@app/common/enum";
import { Role } from "@app/roles/entities/role.entity";

let rolesMock: Role[] = [];

const adminRoleStub = new Role();
adminRoleStub.id = 1;
adminRoleStub.name = RoleName.Admin;

const studentRoleStub = new Role();
studentRoleStub.id = 2;
studentRoleStub.name = RoleName.Student;

const instructorRoleStub = new Role();
instructorRoleStub.id = 3;
instructorRoleStub.name = RoleName.Instructor;

const unexistedRoleStub = new Role();
unexistedRoleStub.id = 3;
unexistedRoleStub.name = "Unexisted role";

rolesMock = [adminRoleStub, studentRoleStub, instructorRoleStub];

export { rolesMock, adminRoleStub, studentRoleStub, instructorRoleStub, unexistedRoleStub };

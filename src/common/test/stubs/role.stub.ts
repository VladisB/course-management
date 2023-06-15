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
studentRoleStub.id = 3;
studentRoleStub.name = RoleName.Instructor;

rolesMock = [adminRoleStub, studentRoleStub];

export { rolesMock, adminRoleStub, studentRoleStub, instructorRoleStub };

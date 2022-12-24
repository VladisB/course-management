import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { RolesService } from "../src/roles/roles.service";
import { CreateRoleDto } from "../src/roles/dto/create-role.dto";
import { Role } from "../src/roles/role.entity";
import { UserViewModel } from "../src/users/view-models";

const mockAdminCredentials: UserViewModel = {
    id: 333331,
    email: "admin@unexisted.com",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
};

const mockStudentCredentials: UserViewModel = {
    id: 333332,
    email: "student@unexisted.com",
    firstName: "John",
    lastName: "Doe",
    role: "student",
};

const mockInstructorCredentials: UserViewModel = {
    id: 333333,
    email: "instructor@unexisted.com",
    firstName: "John",
    lastName: "Doe",
    role: "instructor",
};

const mockNewRole = {
    id: 33333,
    name: "unexisted role",
};

const mockRolesService = {
    createRole: jest.fn((dto: CreateRoleDto) => {
        const role = new Role();
        role.name = dto.name;
        role.id = 1;

        return role;
    }),
    getRoles: jest
        .fn()
        .mockResolvedValue([
            mockAdminCredentials,
            mockStudentCredentials,
            mockInstructorCredentials,
        ]),
};

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let authService: AuthService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(RolesService)
            .useValue(mockRolesService)
            .compile();

        app = moduleFixture.createNestApplication();
        authService = moduleFixture.get<AuthService>(AuthService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Roles Module", () => {
        describe("/roles (GET)", () => {
            it("Successfuly GET roles(3) as an Admin", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(mockAdminCredentials);

                const signInAdmin = await authService.generateTokens(mockAdminCredentials);
                const accessTokenAdmin = signInAdmin.accessToken;

                const { body } = await request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body).toEqual(expect.any(Array));
                expect(body.length).toBe(3);
            });

            it("Fail during getting roles as student", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(
                    mockStudentCredentials,
                );

                const signInStudent = await authService.generateTokens(mockStudentCredentials);
                const accessTokenStudent = signInStudent.accessToken;

                return request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail during getting roles as an Instructor", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(
                    mockInstructorCredentials,
                );

                const signInInstructor = await authService.generateTokens(
                    mockInstructorCredentials,
                );
                const accessTokenInstructor = signInInstructor.accessToken;

                return request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });
        });

        describe("/roles (POST)", () => {
            it("Successfuly create role as an Admin", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(mockAdminCredentials);

                const signInAdmin = await authService.generateTokens(mockAdminCredentials);
                const accessTokenAdmin = signInAdmin.accessToken;

                const { body } = await request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(mockNewRole)
                    .expect(201);

                expect(body).toEqual({
                    ...mockNewRole,
                    id: expect.any(Number),
                });
            });

            it("Fail during creating role as student", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(
                    mockStudentCredentials,
                );

                const signInStudent = await authService.generateTokens(mockStudentCredentials);
                const accessTokenStudent = signInStudent.accessToken;

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(mockNewRole)
                    .expect(403);
            });

            it("Fail during creating role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwtUser").mockResolvedValue(
                    mockInstructorCredentials,
                );

                const signInInstructor = await authService.generateTokens(
                    mockInstructorCredentials,
                );
                const accessTokenInstructor = signInInstructor.accessToken;

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(mockNewRole)
                    .expect(403);
            });
        });
    });
});

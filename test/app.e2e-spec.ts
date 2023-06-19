import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { CreateRoleDto } from "../src/roles/dto/create-role.dto";
import { adminUserStub, instructorUserStub, studentUserStub } from "@app/common/test/stubs";
import { JwtModelFactory } from "@app/auth/model-factories";
import { UpdateRoleDto } from "@app/roles/dto/update-role.dto";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let authService: AuthService;
    let jwtModelFactory: JwtModelFactory;

    let accessTokenAdmin: string;
    let accessTokenStudent: string;
    let accessTokenInstructor: string;

    let lastCreatedRoleId: number;

    const generateToken = async (userStub) => {
        const spyMock = jest.spyOn(authService, "validateJwt").mockResolvedValue(userStub);

        const jwtModel = jwtModelFactory.initJwtModel(userStub);
        const signIn = await authService.generateTokens(jwtModel);

        spyMock.mockRestore();

        return signIn.accessToken;
    };

    const createRoleDto = (randomNumber: number): CreateRoleDto => ({
        name: "newrole_" + randomNumber,
    });

    const updateRoleDto = (randomNumber: number): UpdateRoleDto => ({
        name: "updatedrolename_" + randomNumber,
    });

    const getRandomNumber = (limit = 1000) => Math.floor(Math.random() * limit);

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        authService = moduleFixture.get<AuthService>(AuthService);
        jwtModelFactory = moduleFixture.get<JwtModelFactory>(JwtModelFactory);

        accessTokenAdmin = await generateToken(adminUserStub);
        accessTokenStudent = await generateToken(studentUserStub);
        accessTokenInstructor = await generateToken(instructorUserStub);

        await app.init();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Roles Module", () => {
        describe("/roles (GET)", () => {
            it("Successfuly GET roles(3) as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const { body } = await request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body.records).toEqual(expect.any(Array));
                expect(body.records[0]).toEqual({
                    id: expect.any(Number),
                    name: expect.any(String),
                });
                expect(body.totalRecords).toBeGreaterThanOrEqual(3); // Base roles: admin, student, instructor
            });

            it("Fail during getting roles as student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);

                return request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail during getting roles as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);

                return request(app.getHttpServer())
                    .get("/roles")
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail during getting roles without authorization", async () => {
                return request(app.getHttpServer()).get("/roles").expect(401);
            });
        });

        describe("/roles (POST)", () => {
            it("Successfuly create role as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                const { body } = await request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(201);

                lastCreatedRoleId = body.id;

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: dto.name,
                });
            });

            it("Fail during creating role as student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);

                const randomNumber = getRandomNumber(1000);
                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);

                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role without authorization", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer()).post("/roles").send(dto).expect(401);
            });
        });

        describe("/roles/:id (GET)", () => {
            it("Successfully GET a specific role as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const id = lastCreatedRoleId;

                const { body } = await request(app.getHttpServer())
                    .get(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: expect.any(String),
                });
            });

            it("Fail to GET a specific role as a Student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);

                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .get(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail to GET a specific role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);

                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .get(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail to GET a specific role without authorization", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer()).get(`/roles/${id}`).expect(401);
            });
        });

        describe("/roles/:id (PATCH)", () => {
            it("Successfully update a specific role as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                const { body } = await request(app.getHttpServer())
                    .patch(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: dto.name,
                });
            });

            it("Fail to update a specific role as a Student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);

                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer())
                    .patch(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail to update a specific role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);

                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer())
                    .patch(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail to update a specific role without authorization", async () => {
                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer()).patch(`/roles/${id}`).send(dto).expect(401);
            });
        });

        describe("/roles/:id (DELETE)", () => {
            it("Successfully delete a specific role as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const id = lastCreatedRoleId;
                console.log("DELTED", id);
                await request(app.getHttpServer())
                    .delete(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);
            });

            it("Fail to delete a specific role as a Student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .delete(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail to delete a specific role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .delete(`/roles/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail to delete a specific role without authorization", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer()).delete(`/roles/${id}`).expect(401);
            });
        });
    });
});

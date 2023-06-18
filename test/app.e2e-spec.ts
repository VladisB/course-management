import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { CreateRoleDto } from "../src/roles/dto/create-role.dto";
import { adminUserStub, instructorUserStub, studentUserStub } from "@app/common/test/stubs";
import { JwtModelFactory } from "@app/auth/model-factories";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let authService: AuthService;
    let jwtModelFactory: JwtModelFactory;

    let accessTokenAdmin: string;
    let accessTokenStudent: string;
    let accessTokenInstructor: string;

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
        });

        describe("/roles (POST)", () => {
            it("Successfuly create role as an Admin", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(adminUserStub);

                const randomNumber = Math.floor(Math.random() * 100) + 1;

                const dto = createRoleDto(randomNumber);

                const { body } = await request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(201);

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: dto.name,
                });
            });

            it("Fail during creating role as student", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(studentUserStub);

                const randomNumber = Math.floor(Math.random() * 100) + 1;

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role as an Instructor", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(instructorUserStub);

                const randomNumber = Math.floor(Math.random() * 100) + 1;

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post("/roles")
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(403);
            });
        });
    });
});

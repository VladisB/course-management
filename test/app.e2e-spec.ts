import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { unexistedUserStub } from "@app/common/test/stubs";
import { JwtModelFactory } from "@app/auth/model-factories";
import { RoutePath } from "@app/common/enum";
import {
    createE2ELesson,
    createLessonDto,
    createRoleDto,
    getRandomNumber,
    initE2ETestData,
    updateLessonDto,
    updateRoleDto,
} from "@app/common/test/utils";
import { CourseViewModel } from "@app/courses/view-models";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let authService: AuthService;
    let jwtModelFactory: JwtModelFactory;

    let accessTokenAdmin: string;
    let accessTokenStudent: string;
    let accessTokenInstructor: string;
    let accessTokenUnexistedUser: string;
    let lastCreatedRoleId: number;

    let newCourse: CourseViewModel;

    const generateToken = async (userStub) => {
        const spyMock = jest.spyOn(authService, "validateJwt").mockResolvedValue(userStub);

        const jwtModel = jwtModelFactory.initJwtModel(userStub);
        const signIn = await authService.generateTokens(jwtModel);

        spyMock.mockRestore();

        return signIn.accessToken;
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { adminToken, instructorToken, studentToken, course } = await initE2ETestData(app);

        accessTokenAdmin = adminToken;
        accessTokenStudent = studentToken;
        accessTokenInstructor = instructorToken;

        newCourse = course;

        authService = moduleFixture.get<AuthService>(AuthService);
        jwtModelFactory = moduleFixture.get<JwtModelFactory>(JwtModelFactory);

        accessTokenUnexistedUser = await generateToken(unexistedUserStub);
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Roles Module", () => {
        describe("/roles (GET)", () => {
            it("Successfully GET roles(3) as an Admin", async () => {
                const { body } = await request(app.getHttpServer())
                    .get(RoutePath.Roles)
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
                return request(app.getHttpServer())
                    .get(RoutePath.Roles)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail during getting roles as an Instructor", async () => {
                return request(app.getHttpServer())
                    .get(RoutePath.Roles)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail during getting roles without authorization", async () => {
                return request(app.getHttpServer()).get(RoutePath.Roles).expect(401);
            });
        });

        describe("/roles (POST)", () => {
            it("Successfully create role as an Admin", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                const { body } = await request(app.getHttpServer())
                    .post(RoutePath.Roles)
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
                const randomNumber = getRandomNumber(1000);
                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post(RoutePath.Roles)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role as an Instructor", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer())
                    .post(RoutePath.Roles)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role without authorization", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer()).post(RoutePath.Roles).send(dto).expect(401);
            });
        });

        describe("/roles/:id (GET)", () => {
            it("Successfully GET a specific role as an Admin", async () => {
                const id = lastCreatedRoleId;

                const { body } = await request(app.getHttpServer())
                    .get(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: expect.any(String),
                });
            });

            it("Fail to GET a specific role as a Student", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .get(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail to GET a specific role as an Instructor", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .get(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail to GET a specific role without authorization", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer()).get(`${RoutePath.Roles}/${id}`).expect(401);
            });
        });

        describe("/roles/:id (PATCH)", () => {
            it("Successfully update a specific role as an Admin", async () => {
                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                const { body } = await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    name: dto.name,
                });
            });

            it("Fail to update a specific role as a Student", async () => {
                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail to update a specific role as an Instructor", async () => {
                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail to update a specific role without authorization", async () => {
                const id = lastCreatedRoleId;
                const randomNumber = getRandomNumber(1000);
                const dto = updateRoleDto(randomNumber);

                await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${id}`)
                    .send(dto)
                    .expect(401);
            });
        });

        describe("/roles/:id (DELETE)", () => {
            it("Successfully delete a specific role as an Admin", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(204);
            });

            it("Fail to delete a specific role as a Student", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail to delete a specific role as an Instructor", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Roles}/${id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(403);
            });

            it("Fail to delete a specific role without authorization", async () => {
                const id = lastCreatedRoleId;

                await request(app.getHttpServer()).delete(`${RoutePath.Roles}/${id}`).expect(401);
            });
        });
    });

    describe("Lessons Module", () => {
        describe(`${RoutePath.Lessons} (GET)`, () => {
            it("Successfully GET lessons as an Admin", async () => {
                const { body } = await request(app.getHttpServer())
                    .get(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body.records).toEqual(expect.any(Array));
                expect(body.records[0]).toEqual({
                    id: expect.any(Number),
                    courseId: expect.any(Number),
                    date: expect.any(String),
                    theme: expect.any(String),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Successfully GET lessons as an Instructor", async () => {
                const { body } = await request(app.getHttpServer())
                    .get(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(200);

                expect(body.records).toEqual(expect.any(Array));
                if (body.records.length > 0) {
                    expect(body.records[0]).toEqual({
                        id: expect.any(Number),
                        courseId: expect.any(Number),
                        date: expect.any(String),
                        theme: expect.any(String),
                        course: expect.any(String),
                        instructorList: expect.any(Array),
                    });
                }
            });

            it("Fail during getting lessons as an Student", async () => {
                return request(app.getHttpServer())
                    .get(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail during getting lessons with wrong role", async () => {
                jest.spyOn(authService, "validateJwt").mockResolvedValue(unexistedUserStub);

                return request(app.getHttpServer())
                    .get(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenUnexistedUser}`)
                    .expect(403);
            });

            it("Fail during getting roles without authorization", async () => {
                return request(app.getHttpServer()).get("/roles").expect(401);
            });
        });

        describe(`${RoutePath.Lessons} (POST)`, () => {
            it("Successfully create lesson as an Admin", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createLessonDto(randomNumber, newCourse.id);

                const { body } = await request(app.getHttpServer())
                    .post(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(201);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: dto.theme,
                    date: dto.date.toISOString(),
                    courseId: dto.courseId,
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Successfully create lesson as an Instructor", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createLessonDto(randomNumber, newCourse.id);

                const { body } = await request(app.getHttpServer())
                    .post(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(201);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: dto.theme,
                    date: dto.date.toISOString(),
                    courseId: dto.courseId,
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Fail during creating lesson as student", async () => {
                const randomNumber = getRandomNumber(1000);
                const dto = createLessonDto(randomNumber, newCourse.id);

                return request(app.getHttpServer())
                    .post(RoutePath.Lessons)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail during creating role without authorization", async () => {
                const randomNumber = getRandomNumber(1000);

                const dto = createRoleDto(randomNumber);

                return request(app.getHttpServer()).post(RoutePath.Lessons).send(dto).expect(401);
            });
        });

        describe(`${RoutePath.Lessons}/:id (GET)`, () => {
            it("Successfully GET a specific lesson as an Admin", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const { body } = await request(app.getHttpServer())
                    .get(`${RoutePath.Lessons}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: expect.any(String),
                    date: expect.any(String),
                    courseId: expect.any(Number),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Successfully GET a specific lesson as an Instructor", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const { body } = await request(app.getHttpServer())
                    .get(`${RoutePath.Lessons}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: expect.any(String),
                    date: expect.any(String),
                    courseId: expect.any(Number),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Successfully GET a specific lesson as an Student", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const { body } = await request(app.getHttpServer())
                    .get(`${RoutePath.Lessons}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: expect.any(String),
                    date: expect.any(String),
                    courseId: expect.any(Number),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Fail to GET a specific lesson without authorization", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                await request(app.getHttpServer())
                    .get(`${RoutePath.Lessons}/${lesson.id}`)
                    .expect(401);
            });
        });

        describe(`${RoutePath.Lessons}/:id (PATCH)`, () => {
            it("Successfully update a specific lesson as an Admin", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const randomNumber = getRandomNumber(1000);
                const dto = updateLessonDto(randomNumber, newCourse.id);

                const { body } = await request(app.getHttpServer())
                    .patch(`${RoutePath.Lessons}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .send(dto)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: expect.any(String),
                    date: expect.any(String),
                    courseId: expect.any(Number),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Successfully update a specific lesson as an Instructor", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const randomNumber = getRandomNumber(1000);
                const dto = updateLessonDto(randomNumber, newCourse.id);

                const { body } = await request(app.getHttpServer())
                    .patch(`${RoutePath.Lessons}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .send(dto)
                    .expect(200);

                expect(body).toEqual({
                    id: expect.any(Number),
                    theme: expect.any(String),
                    date: expect.any(String),
                    courseId: expect.any(Number),
                    course: expect.any(String),
                    instructorList: expect.any(Array),
                });
            });

            it("Fail to update a specific lesson as a Student", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const randomNumber = getRandomNumber(1000);
                const dto = updateLessonDto(randomNumber, newCourse.id);

                await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${lesson.id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .send(dto)
                    .expect(403);
            });

            it("Fail to update a specific role without authorization", async () => {
                const { body: lesson } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                const randomNumber = getRandomNumber(1000);
                const dto = updateLessonDto(randomNumber, newCourse.id);

                await request(app.getHttpServer())
                    .patch(`${RoutePath.Roles}/${lesson.id}`)
                    .send(dto)
                    .expect(401);
            });
        });

        describe(`${RoutePath.Lessons}/:id (DELETE)`, () => {
            it("Successfully delete a specific lesson as an Admin", async () => {
                const { body } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Lessons}/${body.id}`)
                    .set("Authorization", `Bearer ${accessTokenAdmin}`)
                    .expect(204);
            });

            it("Successfully delete a specific lesson as Instructor", async () => {
                const { body } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Lessons}/${body.id}`)
                    .set("Authorization", `Bearer ${accessTokenInstructor}`)
                    .expect(204);
            });

            it("Fail to delete a specific lesson as a Student", async () => {
                const { body } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Lessons}/${body.id}`)
                    .set("Authorization", `Bearer ${accessTokenStudent}`)
                    .expect(403);
            });

            it("Fail to delete a specific lesson without authorization", async () => {
                const { body } = await createE2ELesson({
                    app,
                    accessToken: accessTokenAdmin,
                    courseId: newCourse.id,
                });

                await request(app.getHttpServer())
                    .delete(`${RoutePath.Lessons}/${body.id}`)
                    .expect(401);
            });
        });
    });
});

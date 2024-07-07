// TODO: refactor this file
import { CreateRoleDto } from "@app/roles/dto/create-role.dto";
import { UpdateRoleDto } from "@app/roles/dto/update-role.dto";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { E2ETestData, PredefinedUser, RoutePath } from "../enum";
import { Role } from "@app/roles/entities/role.entity";
import { e2eInstructorStub } from "./stubs";
import { CreateLessonDto } from "@app/lessons/dto/create-lesson.dto";
import { CourseViewModel } from "@app/courses/view-models";
import { UpdateLessonDto } from "@app/lessons/dto/update-lesson.dto";

const authLogin = async ({
    email,
    password,
    app,
}: {
    email: string;
    password: string;
    app: INestApplication;
}): Promise<request.Response> => {
    const result = await request(app.getHttpServer()).post(RoutePath.AuthLogin).send({
        email,
        password,
    });

    return result;
};

const createE2ELesson = async ({
    app,
    accessToken,
    courseId,
}: {
    app: INestApplication;
    accessToken: string;
    courseId: number;
}): Promise<request.Response> => {
    return await request(app.getHttpServer())
        .post(RoutePath.Lessons)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            courseId,
            date: new Date().toISOString(),
            theme: "E2E Test lesson" + getRandomNumber(),
        });
};

const checkStatusCode = (res: any, expectedStatus: any = 200): any => {
    if (res.status === expectedStatus) {
        return res;
    }
    const error = res.error;
    const reqData = JSON.parse(JSON.stringify(res)).req;
    throw new Error(`
    error           : ${JSON.stringify(error)}
    request-method  : ${JSON.stringify(reqData.method)}
    request-url     : ${JSON.stringify(reqData.url)}
    request-data    : ${JSON.stringify(reqData.data)}
    request-headers : ${JSON.stringify(reqData.headers)}
    reponse-status  : ${JSON.stringify(res.status)}
    reponse-body    : ${JSON.stringify(res.body)}
    `);
};

const getRandomNumber = (limit = 30000) => Math.floor(Math.random() * limit);

const createRoleDto = (randomNumber: number): CreateRoleDto => ({
    name: "newrole_" + randomNumber,
});

const createLessonDto = (randomNumber: number, courseId: number): CreateLessonDto => ({
    theme: "new_theme_" + randomNumber,
    date: new Date(),
    courseId,
});

const updateLessonDto = (randomNumber: number, courseId: number): UpdateLessonDto => ({
    theme: "upd_theme_" + randomNumber,
    date: new Date(),
    courseId,
});

const updateRoleDto = (randomNumber: number): UpdateRoleDto => ({
    name: "updatedrolename_" + randomNumber,
});

const initE2ETestData = async (
    app: INestApplication,
): Promise<{
    adminToken: string;
    instructorToken: string;
    studentToken: string;
    course: CourseViewModel;
}> => {
    // Login as admin
    const adminLogin = await authLogin({
        email: PredefinedUser.Admin,
        password: E2ETestData.password,
        app,
    });
    checkStatusCode(adminLogin, 200);

    const accessTokenAdmin: string = adminLogin.body.accessToken;

    // Get role list
    const roleList = await request(app.getHttpServer())
        .get(RoutePath.Roles)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .expect(200);

    const instructorRole = roleList.body.records.find((role: Role) => role.name === "instructor");

    // Create instructor
    const instructor = await request(app.getHttpServer())
        .post(RoutePath.UserManagement)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            email: e2eInstructorStub.email,
            password: e2eInstructorStub.password,
            firstName: e2eInstructorStub.firstName,
            lastName: e2eInstructorStub.lastName,
            roleId: instructorRole.id,
        });
    checkStatusCode(instructor, 201);

    // Login as instructor
    const instructorLogin = await authLogin({
        email: e2eInstructorStub.email,
        password: e2eInstructorStub.password,
        app,
    });
    checkStatusCode(instructorLogin, 200);

    const accessTokenInstructor: string = instructorLogin.body.accessToken;

    // Login as student
    const studentLogin = await request(app.getHttpServer()).post(RoutePath.AuthLogin).send({
        email: PredefinedUser.Student,
        password: E2ETestData.password,
    });
    checkStatusCode(studentLogin, 200);

    const accessTokenStudent: string = studentLogin.body.accessToken;

    // Create a faculty
    const facultyResult = await request(app.getHttpServer())
        .post(RoutePath.Faculties)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            name: "E2E Test faculty" + getRandomNumber(),
        });
    checkStatusCode(facultyResult, 201);

    // Create a group
    const groupResult = await request(app.getHttpServer())
        .post(RoutePath.Groups)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            name: "E2E Test group" + getRandomNumber(),
            facultyId: facultyResult.body.id,
        });
    checkStatusCode(groupResult, 201);

    // Create a course
    const course = await request(app.getHttpServer())
        .post(RoutePath.Courses)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            name: "E2E Test course" + getRandomNumber(),
        });
    checkStatusCode(course, 201);

    // Assign instructor to course
    const courseInstructorResult = await request(app.getHttpServer())
        .post(RoutePath.CourseInstructors)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            courseId: course.body.id,
            instructorIdList: [instructor.body.id],
        });
    checkStatusCode(courseInstructorResult, 201);

    // Create 5 lessons to make course available
    const lessons = Array(5).fill(null);
    for (const lesson of lessons) {
        await createE2ELesson({
            app,
            accessToken: accessTokenAdmin,
            courseId: course.body.id,
        });
    }

    // Update group. Assign course to group
    const groupUpdated = await request(app.getHttpServer())
        .patch(`${RoutePath.Groups}/${groupResult.body.id}`)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            courseIdList: [course.body.id],
        });
    checkStatusCode(groupUpdated, 200);

    // Assign student to group
    const updatedStudent = await request(app.getHttpServer())
        .patch(`${RoutePath.UserManagement}/3`)
        .set("Authorization", `Bearer ${accessTokenAdmin}`)
        .send({
            groupId: groupResult.body.id,
        });
    checkStatusCode(updatedStudent, 200);
    return {
        adminToken: accessTokenAdmin,
        instructorToken: accessTokenInstructor,
        studentToken: accessTokenStudent,
        course: course.body,
    };
};

export {
    checkStatusCode,
    getRandomNumber,
    createRoleDto,
    updateRoleDto,
    authLogin,
    initE2ETestData,
    createLessonDto,
    updateLessonDto,
    createE2ELesson,
};

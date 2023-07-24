export enum BaseErrorMessage {
    DB_ERROR = "Database error",
    NOT_FOUND = "The specified resource was not found.",
}

export enum FileMimeType {
    CSV = "text/csv",
    PDF = "application/pdf",
    Text = "text/plain",
    ZIP = "application/zip",
}

export enum S3BucketPath {
    Homework = "homework",
}

export enum RoleName {
    Admin = "admin",
    Student = "student",
    Instructor = "instructor",
}

export enum PredefinedUser {
    Admin = "admin@gmail.com",
    Instructor = "instructor@gmail.com",
    Student = "student@gmail.com",
}

export enum AppLimit {
    PassedLimit = 80,
}

export enum RoutePath {
    Roles = "/roles",
    Lessons = "/lessons",
    AuthLogin = "/auth/login",
    UserManagement = "/users-management",
    CourseInstructors = "/course-instructors",
    Groups = "/groups",
    Faculties = "/faculties",
    Courses = "/courses",
}

// NOTE: Used ONLY for e2e tests on test environment with test database(temporary database)
export enum E2ETestData {
    password = "testsdfsfdDSDD12@",
}

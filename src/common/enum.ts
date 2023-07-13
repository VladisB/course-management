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
